package fr.wellcomm.wellcomm.services;

import fr.wellcomm.wellcomm.entities.*;
import fr.wellcomm.wellcomm.repositories.DossierRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
@Transactional
public class DossierService {
    private final DossierRepository dossierRepository;

    public DossierService(DossierRepository dossierRepository) {
        this.dossierRepository = dossierRepository;
    }

    public Dossier creerDossier(String nom) {
        Dossier dossier = new Dossier(nom);
        return dossierRepository.save(dossier);
    }

    public void creerFil(Long dossierId, String titre, Categorie categorie) {
        Dossier dossier = getDossier(dossierId);
        Fil fil = new Fil(titre, new Date(), categorie);
        dossier.getFils().add(fil);
        dossierRepository.save(dossier);
    }

    public void archiverFil(Long dossierId, Fil fil) {
        Dossier dossier = getDossier(dossierId);
        dossier.getFils().remove(fil);
        if (dossier.getHistorique() != null) {
            dossier.getHistorique().addFil(fil);
        }
        dossierRepository.save(dossier);
    }

    public void ajouterCompteParDossier(Long dossierId, CompteParDossier compte) {
        Dossier dossier = getDossier(dossierId);
        dossier.getComptesParDossier().add(compte);
        dossierRepository.save(dossier);
    }

    public void supprimerCompteParDossier(Long dossierId, CompteParDossier compte) {
        Dossier dossier = getDossier(dossierId);
        dossier.getComptesParDossier().remove(compte);
        dossierRepository.save(dossier);
    }

    private Dossier getDossier(Long id) {
        return dossierRepository.findById(String.valueOf(id))
                .orElseThrow(() -> new IllegalArgumentException("Dossier introuvable"));
    }
}
