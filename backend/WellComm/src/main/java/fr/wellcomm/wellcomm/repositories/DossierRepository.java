package fr.wellcomm.wellcomm.repositories;

import fr.wellcomm.wellcomm.entities.Dossier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DossierRepository extends JpaRepository<Dossier, String> {
    // JpaRepository contient déjà les méthodes : findById, save, findAll, etc.
}