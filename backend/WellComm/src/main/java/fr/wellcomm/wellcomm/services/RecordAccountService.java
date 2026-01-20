package fr.wellcomm.wellcomm.services;

import fr.wellcomm.wellcomm.domain.Role;
import fr.wellcomm.wellcomm.entities.Account;
import fr.wellcomm.wellcomm.entities.Record;
import fr.wellcomm.wellcomm.entities.RecordAccount;
import fr.wellcomm.wellcomm.repositories.AccountRepository;
import fr.wellcomm.wellcomm.repositories.RecordAccountRepository;
import fr.wellcomm.wellcomm.repositories.RecordRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@Transactional
@AllArgsConstructor
public class RecordAccountService {
    private final RecordAccountRepository recordAccountRepository;
    private final AccountRepository accountRepository;
    private final RecordRepository recordRepository;


    public List<RecordAccount> getByRecordId(Long recordId) {
        return recordAccountRepository.findByRecordId(recordId);
    }

    public void createReccordAccount(Account account, Record record, @NotNull Role role) {
        RecordAccount recordAccount = new RecordAccount(account,
                record,
                role.getTitre(),
                role.getPermission());

        recordAccount = recordAccountRepository.save(recordAccount);
        account.getRecordAccounts().put(recordAccount.getId(), recordAccount);
        accountRepository.save(account);
        record.getRecordAccounts().add(recordAccount);
        recordRepository.save(record);
    }

    //update role record_account
    public void updateRoleRecordAccount(String accountUserName, Long recordId, String role) {
        RecordAccount recordAccount =
                recordAccountRepository
                .findByAccountUserNameAndRecordId(accountUserName, recordId)
                .orElseThrow(() -> new RuntimeException("Access not found"));

        // Mise à jour du rôle
        recordAccount.setTitle(role);

        // Sauvegarde
        recordAccountRepository.save(recordAccount);
    }

    //à comparer avec la fonction dans account
    public RecordAccount getRecordAccount(Long userId, long id) {
        return recordAccountRepository.findByAccountIdAndRecordId(userId, id).orElse(null);
    }
}
