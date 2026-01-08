package fr.wellcomm.wellcomm.controllers;

import fr.wellcomm.wellcomm.entities.Message;
import fr.wellcomm.wellcomm.entities.OpenChannel;
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
@RequestMapping("/api/fil/{userName}")
@AllArgsConstructor
public class ChannelController {
    private final ChannelService channelService;

    @Getter
    @Setter
    @AllArgsConstructor
    public static class MessageInfos {
        private Long id;
        private String content;
        private Date date;
        private String authorName;
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

    @GetMapping("/{filId}")
    @PreAuthorize("#userName == authentication.name")
    public ResponseEntity<ChannelInfos> getChannelContent(@PathVariable @SuppressWarnings("unused") String userName, @PathVariable Long filId) {
        OpenChannel channel = channelService.getChannel(filId);

        List<MessageInfos> messages = channel.getMessages().stream()
                .map(m -> new MessageInfos(m.getId(), m.getContent(), m.getDate(), m.getAuthorName(), m.getAuthorRole()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(new ChannelInfos(
                channel.getId(),
                channel.getTitle(),
                channel.getCategory().toString(),
                messages
        ));
    }

    @PostMapping("/{channelID}/messages")
    @PreAuthorize("#userName == authentication.name")
    public ResponseEntity<?> addMessage(
            @PathVariable String userName,
            @PathVariable long channelID,
            @RequestBody String content) {
        OpenChannel channel = channelService.getChannel(channelID);
        if (channel == null)
            return ResponseEntity.badRequest().body("Channel not found");

        Message msg = channelService.addMessage(channel, content, userName);

        return ResponseEntity.ok(new MessageInfos(
                msg.getId(),
                msg.getContent(),
                msg.getDate(),
                msg.getAuthorName(),
                msg.getAuthorRole()
        ));}
}
