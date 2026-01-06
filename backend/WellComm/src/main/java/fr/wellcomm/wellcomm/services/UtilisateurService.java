package fr.wellcomm.wellcomm.services;

import fr.wellcomm.wellcomm.entities.CompteParDossier;
import fr.wellcomm.wellcomm.entities.Dossier;
import fr.wellcomm.wellcomm.entities.Utilisateur;
import fr.wellcomm.wellcomm.repositories.UtilisateurRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class UtilisateurService {
    private final UtilisateurRepository utilisateurRepository;

    public UtilisateurService(UtilisateurRepository utilisateurRepository) {
        this.utilisateurRepository = utilisateurRepository;
    }

    private Utilisateur getUtilisateur(String username) {
        return utilisateurRepository.findById(username)
                .orElseThrow(() -> new IllegalArgumentException("Dossier introuvable"));
    }

    public void ajouterDossier(String utilisateurUsername, Dossier dossier) {
        Utilisateur utilisateur = getUtilisateur(utilisateurUsername);
        utilisateur.getDossiers().add(dossier);
        utilisateurRepository.save(utilisateur);
    }

    public void supprimerDossier(String utilisateurUsername, Dossier dossier) {
        Utilisateur utilisateur = getUtilisateur(utilisateurUsername);
        utilisateur.getDossiers().remove(dossier);
        utilisateurRepository.save(utilisateur);
    }

    public void ajouterCompteParDossier(String utilisateurUsername, CompteParDossier compte) {
        Utilisateur utilisateur = getUtilisateur(utilisateurUsername);
        utilisateur.getComptesParDossier().add(compte);
        utilisateurRepository.save(utilisateur);
    }

    public void supprimerCompteParDossier(String utilisateurUsername, CompteParDossier compte) {
        Utilisateur utilisateur = getUtilisateur(utilisateurUsername);
        utilisateur.getComptesParDossier().remove(compte);
        utilisateurRepository.save(utilisateur);
    }
}
