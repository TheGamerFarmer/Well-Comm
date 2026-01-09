package fr.wellcomm.wellcomm.controllers;

import fr.wellcomm.wellcomm.entities.*;
import fr.wellcomm.wellcomm.services.MessageService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/{userName}/records/{recordId}/channels/{channelId}/messages/{messageId}")
@AllArgsConstructor
public class MessageController {
    private final MessageService messageService;

    @GetMapping("/modify")
    @PreAuthorize("#userName == authentication.name and" +
            "(@securityService.hasMessagePermission(T(fr.wellcomm.wellcomm.domain.Permission).MODIFY_MESSAGE) or" +
                    "@securityService.ownMessage())")
    public ResponseEntity<?> modifyContent(@PathVariable @SuppressWarnings("unused") String userName,
                                           @PathVariable @SuppressWarnings("unused") long recordId,
                                           @PathVariable @SuppressWarnings("unused") long channelId,
                                           @PathVariable long messageId,
                                           @RequestBody String newContent) {
        Message message = messageService.getMessage(messageId);
        if (message == null)
            return ResponseEntity.badRequest().body("Message not found");

        messageService.modifyContent(message, newContent);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/delete")
    @PreAuthorize("#userName == authentication.name and" +
            "(@securityService.hasMessagePermission(T(fr.wellcomm.wellcomm.domain.Permission).DELETE_MESSAGE) or" +
                    "@securityService.ownMessage())")
    public ResponseEntity<?> deleteMessage(@PathVariable @SuppressWarnings("unused") String userName,
                                           @PathVariable @SuppressWarnings("unused") long recordId,
                                           @PathVariable @SuppressWarnings("unused") long channelId,
                                           @PathVariable Long messageId) {
        Message message = messageService.getMessage(messageId);
        if (message == null)
            return ResponseEntity.badRequest().body("Message not found");

        messageService.deleteMessage(message);
        return ResponseEntity.ok().build();
    }
}
