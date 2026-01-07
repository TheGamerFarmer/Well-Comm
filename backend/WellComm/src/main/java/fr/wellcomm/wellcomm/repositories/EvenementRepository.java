package fr.wellcomm.wellcomm.repositories;

import fr.wellcomm.wellcomm.entities.Evenement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EvenementRepository extends JpaRepository<Evenement, String> {
    // JpaRepository contient déjà les méthodes : findById, save, findAll, etc.
}