package fr.wellcomm.wellcomm.controllers;

import fr.wellcomm.wellcomm.entities.*;
import fr.wellcomm.wellcomm.services.MessageService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/{userName}/records/{recordId}/channels/{channelId}/messages/{messageId}")
@AllArgsConstructor
public class MessageController {
    private final MessageService messageService;
    private final SimpMessagingTemplate messagingTemplate;

    @PutMapping("/update")
    @PreAuthorize("#userName == authentication.name and " +
            "(@securityService.hasMessagePermission(T(fr.wellcomm.wellcomm.domain.Permission).MODIFY_MESSAGE) or " +
            "@securityService.ownMessage())")
    public ResponseEntity<?> modifyContent(@PathVariable String userName,
                                           @PathVariable long recordId,
                                           @PathVariable long channelId,
                                           @PathVariable Long messageId,
                                           @RequestBody String newContent) {

        Message message = messageService.getMessage(messageId);
        if (message == null) {
            return ResponseEntity.badRequest().body("Message not found");
        }

        messageService.modifyContent(message, newContent);

        String destination = "/topic/messages/" + channelId;
        Map<String, Object> payload = new HashMap<>();
        payload.put("id", messageId);
        payload.put("content", newContent);
        payload.put("type", "UPDATE");

        messagingTemplate.convertAndSend(destination, (Object) payload);

        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/delete")
    @PreAuthorize("#userName == authentication.name and" +
            "(@securityService.hasMessagePermission(T(fr.wellcomm.wellcomm.domain.Permission).DELETE_MESSAGE) or" +
                    "@securityService.ownMessage())")
    public ResponseEntity<?> deleteMessage(@PathVariable @SuppressWarnings("unused") String userName,
                                           @PathVariable @SuppressWarnings("unused") long recordId,
                                           @PathVariable @SuppressWarnings("unused") long channelId,
                                           @PathVariable Long messageId) {
        Message message = messageService.getMessage(messageId);
        if (message == null) return ResponseEntity.badRequest().body("Message not found");


        String deletedContent = "Ce message a été supprimé\u200B";

        return modifyContent(userName,recordId,channelId,messageId,deletedContent);
    }
}
