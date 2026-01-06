package fr.wellcomm.wellcomm.repositories;

import fr.wellcomm.wellcomm.entities.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UtilisateurRepository extends JpaRepository<Utilisateur, String> {
    // JpaRepository contient déjà les méthodes : findById, save, findAll, etc.
    Utilisateur findByuserName(String userName);
}