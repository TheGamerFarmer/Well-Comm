package fr.wellcomm.wellcomm.repositories;

import fr.wellcomm.wellcomm.entities.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    // JpaRepository contient déjà les méthodes : findById, save, findAll, etc.

    List<Message> findByChannelIdOrderByDateAsc(Long channelId);

    long countByChannelId(Long channelId);
}