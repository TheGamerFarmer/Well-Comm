package fr.wellcomm.wellcomm.repositories;

import fr.wellcomm.wellcomm.entites.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MessageRepository extends JpaRepository<Message, String> {
    // JpaRepository contient déjà les méthodes : findById, save, findAll, etc.
}