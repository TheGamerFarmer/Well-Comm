package fr.wellcomm.wellcomm.repositories;

import fr.wellcomm.wellcomm.entities.RecordAccount;
import fr.wellcomm.wellcomm.entities.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface RecordAccountRepository extends JpaRepository<RecordAccount, Long> {
    // Trouver tous les accès d'un utilisateur spécifique
    List<RecordAccount> findByAccount(Account account);

    Optional<RecordAccount> findByAccountUserNameAndRecordId(String userName, long recordId);

    public interface RecordAccountRepository extends JpaRepository<RecordAccount, Long> {

        List<RecordAccount> findByRecordId(Long recordId);
    }

}