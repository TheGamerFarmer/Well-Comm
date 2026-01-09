package fr.wellcomm.wellcomm.controllers;

import fr.wellcomm.wellcomm.entities.Account;
import fr.wellcomm.wellcomm.entities.Message;
import fr.wellcomm.wellcomm.entities.OpenChannel;
import fr.wellcomm.wellcomm.services.AccountService;
import fr.wellcomm.wellcomm.services.ChannelService;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/{userName}/records/{recordId}/channels/{channelId}")
@AllArgsConstructor
public class ChannelController {
    private final ChannelService channelService;
    private final AccountService accountService;

    @Getter
    @Setter
    @AllArgsConstructor
    public static class MessageInfos {
        private Long id;
        private String content;
        private Date date;
        private String authorUserName;
        private String authorTitle;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    public static class ChannelInfos {
        private Long id;
        private String title;
        private String category;
        private List<MessageInfos> messages;
    }

    @GetMapping("/")
    @PreAuthorize("#userName == authentication.name and" +
            "@securityService.hasChannelPermission(T(fr.wellcomm.wellcomm.domain.Permission).SEND_MESSAGE)")
    public ResponseEntity<ChannelInfos> getChannelContent(@PathVariable @SuppressWarnings("unused") String userName,
                                                          @PathVariable @SuppressWarnings("unused") long recordId,
                                                          @PathVariable Long channelId) {
        OpenChannel channel = channelService.getChannel(channelId);

        List<MessageInfos> messages = channel.getMessages().values().stream()
                .map(m -> new MessageInfos(m.getId(), m.getContent(), m.getDate(), m.getAuthor().getUserName(), m.getAuthorTitle()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(new ChannelInfos(
                channel.getId(),
                channel.getTitle(),
                channel.getCategory().toString(),
                messages
        ));
    }

    @PostMapping("/messages")
    @PreAuthorize("#userName == authentication.name and" +
            "@securityService.hasChannelPermission(T(fr.wellcomm.wellcomm.domain.Permission).SEND_MESSAGE)")
    public ResponseEntity<?> addMessage(
            @PathVariable String userName,
            @PathVariable @SuppressWarnings("unused") long recordId,
            @PathVariable long channelId,
            @RequestBody String content) {
        Account account = accountService.getUser(userName);
        if (account == null)
            return ResponseEntity.badRequest().body("Message not found");
        OpenChannel channel = channelService.getChannel(channelId);
        if (channel == null)
            return ResponseEntity.badRequest().body("Channel not found");

        Message msg = channelService.addMessage(channel, content, account);

        return ResponseEntity.ok(new MessageInfos(
                msg.getId(),
                msg.getContent(),
                msg.getDate(),
                msg.getAuthor().getUserName(),
                msg.getAuthorTitle()
        ));
    }
}
