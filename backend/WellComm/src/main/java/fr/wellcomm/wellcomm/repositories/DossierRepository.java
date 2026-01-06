package fr.wellcomm.wellcomm.repositories;

import fr.wellcomm.wellcomm.entities.Dossier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DossierRepository extends JpaRepository<Dossier, String> {
    // JpaRepository contient déjà les méthodes : findById, save, findAll, etc.
    @Query("SELECT c.dossier FROM CompteParDossier c WHERE c.utilisateur.userName = :userName")
    List<Dossier> findDossiersByUtilisateurUserName(@Param("userName") String email);
}