package fr.wellcomm.wellcomm.services;

import fr.wellcomm.wellcomm.entities.Fil;
import fr.wellcomm.wellcomm.entities.Message;
import fr.wellcomm.wellcomm.repositories.FilRepository;
import fr.wellcomm.wellcomm.repositories.MessageRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Date;


@Service
@Transactional
@AllArgsConstructor
public class FilService {

    private final FilRepository filRepository;
    private final MessageRepository messageRepository;

    public Fil getFilById(Long id) {
        return filRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Fil non trouvé"));
    }

    public Message ajouterMessageAuFil(Long filId, String contenu, String userName, String role) {
        Fil fil = getFilById(filId);

        Message message = new Message();
        message.setContenu(contenu);
        message.setAuteurNom(userName);
        message.setAuteurRole(role != null ? role : "Utilisateur");
        message.setDateEnvoi(new Date());
        message.setFil(fil);

        return messageRepository.save(message);
    }
}
