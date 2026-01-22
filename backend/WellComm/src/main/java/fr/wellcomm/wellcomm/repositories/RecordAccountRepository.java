package fr.wellcomm.wellcomm.repositories;

import fr.wellcomm.wellcomm.entities.RecordAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface RecordAccountRepository extends JpaRepository<RecordAccount, Long> {
    Optional<RecordAccount> findByAccountIdAndRecordId(long userId, long recordId);

    List<RecordAccount> findByRecordId(Long recordId);

}