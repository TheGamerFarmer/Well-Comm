package fr.wellcomm.wellcomm.repositories;

import fr.wellcomm.wellcomm.entites.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UtilisateurRepository extends JpaRepository<Utilisateur, String> {
    // JpaRepository contient déjà les méthodes : findById, save, findAll, etc.
}