package fr.wellcomm.wellcomm.controllers;

import fr.wellcomm.wellcomm.entities.Message;
import fr.wellcomm.wellcomm.services.MessageService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/message/{userName}")
@AllArgsConstructor
public class MessageController {
    private final MessageService messageService;

    @GetMapping("/{messageId}/modify")
    @PreAuthorize("#userName == authentication.name")
    public ResponseEntity<?> modifyContent(@PathVariable String userName,
                                           @PathVariable long messageId,
                                           @RequestBody String newContent) {
        Message message = messageService.getMessage(messageId);
        if (message == null)
            return ResponseEntity.badRequest().body("Message not found");

        messageService.modifyContent(message, newContent);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{messageId}/delete")
    @PreAuthorize("#userName == authentication.name")
    public ResponseEntity<?> deleteMessage(@PathVariable String userName,
                                           @PathVariable Long messageId) {
        Message message = messageService.getMessage(messageId);
        if (message == null)
            return ResponseEntity.badRequest().body("Message not found");

        messageService.deleteMessage(message);
        return ResponseEntity.ok().build();
    }
}
