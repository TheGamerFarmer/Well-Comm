package fr.wellcomm.wellcomm.repositories;

import fr.wellcomm.wellcomm.entities.CloseChannel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CloseChannelRepository extends JpaRepository<CloseChannel, Long> {
}
