package fr.wellcomm.wellcomm.services;

import fr.wellcomm.wellcomm.entities.CompteParDossier;
import fr.wellcomm.wellcomm.repositories.CompteParDossierRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class CompteParDossierService {
    private final CompteParDossierRepository compteParDossierRepository;

    public CompteParDossierService(CompteParDossierRepository compteParDossierRepository) {
        this.compteParDossierRepository = compteParDossierRepository;
    }

    private CompteParDossier getCompteParDossier(Long id) {
        return compteParDossierRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Dossier introuvable"));
    }
}
