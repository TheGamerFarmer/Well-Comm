package fr.wellcomm.wellcomm.services;

import fr.wellcomm.wellcomm.entities.*;
import fr.wellcomm.wellcomm.repositories.CompteParDossierRepository;
import fr.wellcomm.wellcomm.repositories.DossierRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import java.util.Date;
import fr.wellcomm.wellcomm.entities.*;
import fr.wellcomm.wellcomm.repositories.FilRepository;
import lombok.AllArgsConstructor;
import java.util.List;

@Service
@Transactional
@AllArgsConstructor
public class DossierService {
    private final DossierRepository dossierRepository;
    private final FilRepository filRepository;
    private final CompteParDossierRepository compteParDossierRepository;

    // --- Méthodes de lecture (utilisées par le Controller) ---

    public List<Dossier> getDossiersAccessibles(String userName) {
        return dossierRepository.findDossiersByUtilisateurUserName(userName);
    }

    public List<Fil> getFilsParCategorie(Long dossierId, Categorie categorie) {
        return filRepository.findByDossierIdAndCategorie(dossierId, categorie);
    }

    // --- Méthodes d'écriture et gestion ---

    public Dossier creerDossier(String nom) {
        Dossier dossier = new Dossier(nom);
        return dossierRepository.save(dossier);
    }

    public void archiverFil(Long dossierId, Long filId) {
        Dossier dossier = getDossier(dossierId);
        Fil fil = filRepository.findById(filId)
                .orElseThrow(() -> new IllegalArgumentException("Fil introuvable"));

        dossier.getFils().remove(fil);
        if (dossier.getHistorique() != null) {
            dossier.getHistorique().addFil(fil);
        }
        dossierRepository.save(dossier);
    }

    public Fil creerFil(Long dossierId, String titre, Categorie categorie, String contenu, String userName) {
        // 1. On récupère le dossier parent
        Dossier dossier = getDossier(dossierId);

        // 2. On récupère le rôle de l'utilisateur pour ce dossier spécifique
        String roleAutomatique = compteParDossierRepository
                .findByUtilisateurUserNameAndDossierId(userName, dossierId)
                .map(CompteParDossier::getTitre)
                .orElse("Membre");

        // 3. Création du fil ET lien avec le dossier
        Fil fil = new Fil();
        fil.setTitre(titre);
        fil.setDatedecreation(new Date());
        fil.setCategorie(categorie);
        fil.setDossier(dossier);

        // 4. Création du message initial
        Message premierMessage = new Message();
        premierMessage.setContenu(contenu);
        premierMessage.setAuteurNom(userName);
        premierMessage.setAuteurRole(roleAutomatique);
        premierMessage.setDateEnvoi(new Date());
        premierMessage.setFil(fil);

        // 5. On ajoute le message au fil et le fil au dossier
        fil.getMessages().add(premierMessage);
        dossier.getFils().add(fil);

        // 6. On sauvegarde le dossier (la cascade s'occupe du fil et du message)
        Dossier sauvegarde = dossierRepository.save(dossier);

        // On retourne le dernier fil ajouté
        return sauvegarde.getFils().getLast();
    }

    private Dossier getDossier(Long id) {
        // Utilisation directe de l'ID sans conversion String si possible selon ton Repository
        return dossierRepository.findById(String.valueOf(id))
                .orElseThrow(() -> new IllegalArgumentException("Dossier introuvable"));
    }
}
