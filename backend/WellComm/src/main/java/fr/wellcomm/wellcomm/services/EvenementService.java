package fr.wellcomm.wellcomm.services;

import fr.wellcomm.wellcomm.entities.Evenement;
import fr.wellcomm.wellcomm.repositories.EvenementRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class EvenementService {
    private final EvenementRepository evenementRepository;

    public EvenementService(EvenementRepository evenementRepository) {
        this.evenementRepository = evenementRepository;
    }

    private Evenement getEvenement(Long id) {
        return evenementRepository.findById(String.valueOf(id))
                .orElseThrow(() -> new IllegalArgumentException("Dossier introuvable"));
    }
}
