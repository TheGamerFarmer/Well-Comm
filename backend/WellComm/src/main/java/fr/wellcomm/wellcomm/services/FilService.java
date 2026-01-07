package fr.wellcomm.wellcomm.services;

import fr.wellcomm.wellcomm.entities.CompteParDossier;
import fr.wellcomm.wellcomm.entities.Fil;
import fr.wellcomm.wellcomm.entities.Message;
import fr.wellcomm.wellcomm.repositories.CompteParDossierRepository;
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
    private final CompteParDossierRepository compteParDossierRepository;


    public Fil getFilById(Long id) {
        return filRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Fil non trouvé"));
    }

    public Message ajouterMessageAuFil(Long filId, String contenu, String userName) {
        Fil fil = getFilById(filId);

        // 1. On récupère l'ID du dossier via le fil
        Long dossierId = fil.getDossier().getId();

        // 2. On cherche le rôle (titre) de l'utilisateur pour ce dossier
        String roleAutomatique = compteParDossierRepository
                .findByUtilisateurUserNameAndDossierId(userName, dossierId)
                .map(CompteParDossier::getTitre)
                .orElse("Membre");

        // 3. Création du message
        Message message = new Message();
        message.setContenu(contenu);
        message.setAuteurNom(userName);
        message.setAuteurRole(roleAutomatique); // Utilisation du rôle trouvé en base
        message.setDateEnvoi(new Date());
        message.setFil(fil);

        return messageRepository.save(message);
    }
}
