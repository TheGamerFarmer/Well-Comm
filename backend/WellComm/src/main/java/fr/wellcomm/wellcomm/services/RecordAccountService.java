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

    public List<RecordAccount> getByRecordId(long recordId) {
        return recordAccountRepository.findByRecordId(recordId);
    }

    public RecordAccount createReccordAccount(Account account, Record record, @NotNull Role role) {
        RecordAccount recordAccount = new RecordAccount(account,
                record,
                role);

        recordAccount = recordAccountRepository.save(recordAccount);
        account.getRecordAccounts().put(recordAccount.getId(), recordAccount);
        accountRepository.save(account);
        record.getRecordAccounts().put(recordAccount.getId(), recordAccount);
        recordRepository.save(record);
        return recordAccount;

    }

    public void updateRoleRecordAccount(long accountUserId, @NotNull Record record, @NotNull Role role) {
        RecordAccount recordAccount = recordAccountRepository.findByAccountIdAndRecordId(accountUserId, record.getId())
                .orElseThrow(() -> new RuntimeException("Access not found"));

        recordAccount.setTitle(role.getTitre());
        recordAccount.setPermissions(role.getPermission());

        recordAccountRepository.save(recordAccount);
    }

    public RecordAccount getRecordAccount(long userId, long id) {
        return recordAccountRepository.findByAccountIdAndRecordId(userId, id).orElse(null);
    }
}
