package fr.wellcomm.wellcomm.controllers;

import fr.wellcomm.wellcomm.entities.*;
import fr.wellcomm.wellcomm.entities.Record;
import fr.wellcomm.wellcomm.services.AccountService;
import fr.wellcomm.wellcomm.services.MessageService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/{userName}/record/{recordId}/channel/{channelId}/message/{messageId}")
@AllArgsConstructor
public class MessageController {
    private final MessageService messageService;
    private final AccountService accountService;

    @GetMapping("/modify")
    @PreAuthorize("#userName == authentication.name")
    public ResponseEntity<?> modifyContent(@PathVariable String userName,
                                           @PathVariable long recordId,
                                           @PathVariable long channelId,
                                           @PathVariable long messageId,
                                           @RequestBody String newContent) {
        Account account = accountService.getUser(userName);
        if (account == null)
            return ResponseEntity.badRequest().body("Message not found");
        RecordAccount recordAccount = account.getRecordAccounts().get(recordId);
        if (recordAccount == null)
            return ResponseEntity.badRequest().body("RecordAccount not found");
        Record record = recordAccount.getRecord();
        if (record == null)
            return ResponseEntity.badRequest().body("Record not found");
        OpenChannel channel = record.getOpenChannels().get(channelId);
        if (channel == null)
            return ResponseEntity.badRequest().body("Channel not found");
        Message message = messageService.getMessage(messageId);
        if (message == null)
            return ResponseEntity.badRequest().body("Message not found");

        messageService.modifyContent(message, newContent);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/delete")
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
