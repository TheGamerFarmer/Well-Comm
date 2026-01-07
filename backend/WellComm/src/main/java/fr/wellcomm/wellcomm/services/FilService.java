package fr.wellcomm.wellcomm.services;

import fr.wellcomm.wellcomm.entities.Dossier;
import fr.wellcomm.wellcomm.entities.Fil;
import fr.wellcomm.wellcomm.entities.Message;
import fr.wellcomm.wellcomm.repositories.FilRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
@Transactional
public class FilService {

    private final FilRepository filRepository;

    public FilService(FilRepository filRepository) {
        this.filRepository = filRepository;
    }

    public void envoyerMessage(Long FilId, String contenu, String auteurnom, String auteurrole) {
        Fil fil = getFil(FilId);
        Message message = new Message(contenu, auteurnom, auteurrole);
        fil.getMessages().add(message);
        filRepository.save(fil);
    }

    public void supprimerMessage(Long FilId, Message message) {
        Fil fil = getFil(FilId);
        fil.getMessages().remove(message);
        filRepository.save(fil);
    }

    private Fil getFil(Long id) {
        return filRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Dossier introuvable"));
    }
}
