package fr.wellcomm.wellcomm.services;

import fr.wellcomm.wellcomm.entities.Message;
import fr.wellcomm.wellcomm.repositories.MessageRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class MessageService {
    private final MessageRepository messageRepository;

    public MessageService(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    public void modifierContenu(Long messageId, String contenu) {
        Message message = getMessage(messageId);
        message.setContenu(contenu);
        messageRepository.save(message);
    }

    private Message getMessage(Long id) {
        return messageRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Dossier introuvable"));
    }
}
