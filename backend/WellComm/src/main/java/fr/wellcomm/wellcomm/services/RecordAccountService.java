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
import java.util.Date;

@Service
@Transactional
@AllArgsConstructor
public class RecordAccountService {
    private final RecordAccountRepository recordAccountRepository;
    private final RecordRepository recordRepository;
    private final AccountRepository accountRepository;

    public List<RecordAccount> getByRecordId(Long recordId) {
        return recordAccountRepository.findByRecordId(recordId);
    }

    public RecordAccount getReccordAccount(long id) {
        return recordAccountRepository.findById(id).orElse(null);
    }

    public RecordAccount createReccordAccount(Account account, Record record, @NotNull Role role) {
        RecordAccount recordAccount = new RecordAccount(account,
                record,
                role.getTitre(),
                role.getPermission());

        account.getRecordAccounts().add(recordAccount);
        accountRepository.save(account);
        //record.getRecordAccounts().add(recordAccount);
        //recordRepository.save(record);
        return recordAccount;
    }

    public List<Record> getRecordAccounts(String userName, Long id) {
            return recordAccountRepository.findByAccountUserNameAndRecordId(userName, id);
        }
}
