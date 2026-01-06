package fr.wellcomm.wellcomm.repositories;

import fr.wellcomm.wellcomm.entites.Fil;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FilRepository extends JpaRepository<Fil, String> {
    // JpaRepository contient déjà les méthodes : findById, save, findAll, etc.
}