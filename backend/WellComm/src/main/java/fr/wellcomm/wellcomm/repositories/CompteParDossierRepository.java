package fr.wellcomm.wellcomm.repositories;

import fr.wellcomm.wellcomm.entities.CompteParDossier;
import fr.wellcomm.wellcomm.entities.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CompteParDossierRepository extends JpaRepository<CompteParDossier, Long> {

    // Trouver tous les accès d'un utilisateur spécifique
    List<CompteParDossier> findByUtilisateur(Utilisateur utilisateur);
}