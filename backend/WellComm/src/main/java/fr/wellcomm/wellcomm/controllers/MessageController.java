package fr.wellcomm.wellcomm.controllers;

import fr.wellcomm.wellcomm.entities.*;
import fr.wellcomm.wellcomm.services.AccountService;
import fr.wellcomm.wellcomm.services.MessageService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/{userId}/records/{recordId}/channels/{channelId}/messages/{messageId}")
@AllArgsConstructor
public class MessageController {
    private final MessageService messageService;
    private final SimpMessagingTemplate messagingTemplate;

    @PutMapping("/update")
    @PreAuthorize("#userId.toString() == authentication.name and " +
            "(@securityService.hasMessagePermission(T(fr.wellcomm.wellcomm.domain.Permission).MODIFY_MESSAGE) or " +
            "@securityService.ownMessage())")
    public ResponseEntity<?> modifyContent(@PathVariable Long userId,
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
    @PreAuthorize("#userId.toString() == authentication.name and" +
            "(@securityService.hasMessagePermission(T(fr.wellcomm.wellcomm.domain.Permission).DELETE_MESSAGE) or" +
                    "@securityService.ownMessage())")
    public ResponseEntity<?> deleteMessage(@PathVariable Long userId,
                                           @PathVariable long recordId,
                                           @PathVariable long channelId,
                                           @PathVariable Long messageId) {

        Message message = messageService.getMessage(messageId);
        if (message == null) {
            return ResponseEntity.badRequest().body("Message not found");
        }

        messageService.deleteMessage(message);

        String destination = "/topic/messages/" + channelId;
        Map<String, Object> payload = new HashMap<>();
        payload.put("id", messageId);
        payload.put("type", "DELETE");
        payload.put("content", "Ce message a été supprimé\u200B");
        payload.put("isDeleted", true);

        messagingTemplate.convertAndSend(destination, (Object) payload);

        return ResponseEntity.ok().build();
    }
}