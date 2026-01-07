package fr.wellcomm.wellcomm.services;

import fr.wellcomm.wellcomm.entities.CompteParDossier;
import fr.wellcomm.wellcomm.entities.Dossier;
import fr.wellcomm.wellcomm.entities.Utilisateur;
import fr.wellcomm.wellcomm.repositories.SessionRepository;
import fr.wellcomm.wellcomm.repositories.UtilisateurRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@Transactional
@AllArgsConstructor
public class UtilisateurService {
    private final UtilisateurRepository utilisateurRepository;
    private final SessionRepository sessionRepository;

    public Utilisateur getUtilisateur(String username) {
        return utilisateurRepository.findById(username)
                .orElseThrow(() -> new IllegalArgumentException("Dossier introuvable"));
    }

    public void deleteUtilisateur(String username) {
        sessionRepository.deleteByUser(getUtilisateur(username));
        utilisateurRepository.deleteById(username);
    }

    public void saveUser(Utilisateur utilisateur) {
        utilisateurRepository.save(utilisateur);
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
