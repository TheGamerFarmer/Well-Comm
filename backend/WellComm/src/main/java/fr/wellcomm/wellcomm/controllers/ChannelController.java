package fr.wellcomm.wellcomm.controllers;

import com.fasterxml.jackson.annotation.JsonProperty;
import fr.wellcomm.wellcomm.entities.Account;
import fr.wellcomm.wellcomm.entities.Message;
import fr.wellcomm.wellcomm.entities.OpenChannel;
import fr.wellcomm.wellcomm.entities.ClosedChannel;
import fr.wellcomm.wellcomm.services.AccountService;
import fr.wellcomm.wellcomm.services.ChannelService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/{userId}/records/{recordId}")
@AllArgsConstructor
public class ChannelController {
    private final ChannelService channelService;
    private final AccountService accountService;
    private final SimpMessagingTemplate messagingTemplate;
    public record MessageInfos (
        long id,
        String content,
        Date date,
        String authorUserName,
        String authorTitle,
        @JsonProperty("isDeleted")
        boolean isDeleted
    ) {}

    public record ChannelInfos (long id, String title, String category, List<MessageInfos> messageInfos) {}

    @GetMapping("/channels/{channelId}")
    @PreAuthorize("#userId.toString() == authentication.name and" +
            "@securityService.hasChannelPermission(T(fr.wellcomm.wellcomm.domain.Permission).SEE_MESSAGE)")
    public ResponseEntity<ChannelInfos> getChannelContent(@PathVariable @SuppressWarnings("unused") Long userId,
                                                          @PathVariable @SuppressWarnings("unused") long recordId,
                                                          @PathVariable Long channelId) {
        OpenChannel channel = channelService.getChannel(channelId);

        List<MessageInfos> messages = channel.getMessages().values().stream()
                .map(m -> new MessageInfos(m.getId(), m.getContent(), m.getDate(), m.getAuthor().getUserName(), m.getAuthorTitle(),m.isDeleted()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(new ChannelInfos(
                channel.getId(),
                channel.getTitle(),
                channel.getCategory().toString(),
                messages
        ));
    }

    @PostMapping("/channels/{channelId}/messages")
    @PreAuthorize("#userId.toString() == authentication.name and" +
            "@securityService.hasChannelPermission(T(fr.wellcomm.wellcomm.domain.Permission).SEND_MESSAGE)")
    public ResponseEntity<?> addMessage(
            @PathVariable Long userId,
            @PathVariable @SuppressWarnings("unused") long recordId,
            @PathVariable long channelId,
            @RequestBody String content) {

        Account account = accountService.getUser(userId);
        if (account == null) return ResponseEntity.badRequest().body("User not found");

        OpenChannel channel = channelService.getChannel(channelId);
        if (channel == null) return ResponseEntity.badRequest().body("Channel not found");

        Message msg = channelService.addMessage(channel, content, account);

        MessageInfos response = new MessageInfos(
                msg.getId(),
                msg.getContent(),
                msg.getDate(),
                msg.getAuthor().getUserName(),
                msg.getAuthorTitle(),
                msg.isDeleted()
        );

        String destination = "/topic/messages/" + channelId;
        messagingTemplate.convertAndSend(destination, response);

        return ResponseEntity.ok(response);
    }


    @GetMapping("/closechannels/{channelId}")
    @PreAuthorize("#userId.toString() == authentication.name and" +
            "@securityService.hasChannelPermission(T(fr.wellcomm.wellcomm.domain.Permission).SEE_MESSAGE)")
    public ResponseEntity<ChannelInfos> getCloseChannelContent(
            @PathVariable @SuppressWarnings("unused") Long userId,
            @PathVariable @SuppressWarnings("unused") long recordId,
            @PathVariable Long channelId) {

        ClosedChannel channel = channelService.getCloseChannel(channelId);
        if (channel == null) {
            return ResponseEntity.notFound().build();
        }

        List<MessageInfos> messages = channel.getMessages().values().stream()
                .map(m -> new MessageInfos(
                        m.getId(),
                        m.getContent(),
                        m.getDate(),
                        m.getAuthor().getUserName(),
                        m.getAuthorTitle(),
                        m.isDeleted()
                ))
                .collect(Collectors.toList());

        return ResponseEntity.ok(new ChannelInfos(
                channel.getId(),
                channel.getTitle(),
                channel.getCategory().toString(),
                messages
        ));
    }
}