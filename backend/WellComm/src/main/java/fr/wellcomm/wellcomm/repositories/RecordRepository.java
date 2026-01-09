package fr.wellcomm.wellcomm.repositories;

import fr.wellcomm.wellcomm.entities.Record;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RecordRepository extends JpaRepository<Record, Long> {
}