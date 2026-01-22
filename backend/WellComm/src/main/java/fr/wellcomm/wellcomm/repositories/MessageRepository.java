package fr.wellcomm.wellcomm.repositories;

import fr.wellcomm.wellcomm.entities.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    long countByChannelId(Long channelId);
}