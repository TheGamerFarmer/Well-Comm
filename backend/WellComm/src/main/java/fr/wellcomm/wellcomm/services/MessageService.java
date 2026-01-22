package fr.wellcomm.wellcomm.services;

import fr.wellcomm.wellcomm.entities.Message;
import fr.wellcomm.wellcomm.repositories.MessageRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.stereotype.Service;

@Service
@Transactional
@AllArgsConstructor
public class MessageService {
    private final MessageRepository messageRepository;

    public Message getMessage(Long id) {
        return messageRepository.findById(id).orElse(null);
    }

    public void modifyContent(@NotNull Message message, String content) {
        message.setContent(content);
        messageRepository.save(message);
    }

    public void deleteMessage(@NotNull Message message) {
        message.setDeleted(true);
        message.setContent("Ce message a été supprimé\u200B");
        messageRepository.save(message);
    }

    public long getNbMessage(Long channelId) {
        return messageRepository.countByChannelId(channelId);
    }
}