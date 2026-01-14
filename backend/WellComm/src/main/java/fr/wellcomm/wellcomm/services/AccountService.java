package fr.wellcomm.wellcomm.services;

import fr.wellcomm.wellcomm.entities.Account;
import fr.wellcomm.wellcomm.entities.RecordAccount;
import fr.wellcomm.wellcomm.repositories.RecordAccountRepository;
import fr.wellcomm.wellcomm.repositories.SessionRepository;
import fr.wellcomm.wellcomm.repositories.AccountRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.stereotype.Service;

@Service
@Transactional
@AllArgsConstructor
public class AccountService {
    private final AccountRepository accountRepository;
    private final SessionRepository sessionRepository;
    private final RecordAccountService recordAccountService;
    private final RecordAccountRepository recordAccountRepository;

    public Account getUser(String username) {
        return accountRepository.findById(username)
                .orElse(null);
    }

    public void deleteUser(Account account) {
        sessionRepository.deleteByAccount(account);
        accountRepository.deleteById(account.getUserName());
    }

    public void saveUser(Account account) {
        accountRepository.save(account);
    }

    public void addRecordAccount(Account account, @NotNull RecordAccount recordAccount) {
        recordAccount.setAccount(account);
        recordAccountRepository.save(recordAccount);
        account.getRecordAccounts().put(recordAccount.getId(), recordAccount);
        accountRepository.save(account);
    }

    public void deleteRecordAccount(@NotNull Account account, @NotNull RecordAccount recordAccount) {
        account.getRecordAccounts().remove(recordAccount.getId());
        accountRepository.save(account);
    }
}
