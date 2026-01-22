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
import java.time.LocalDateTime;

@Service
@Transactional
@AllArgsConstructor
public class AccountService {
    private final AccountRepository accountRepository;
    private final SessionRepository sessionRepository;
    private final RecordAccountRepository recordAccountRepository;

    private static final int MAX_FAILED_ATTEMPTS = 5;
    private static final long LOCK_TIME_DURATION = 15;

    public Account getUser(Long userId) {
        return accountRepository.findById(userId)
                .orElse(null);
    }

    public Account getUserByUserName(String username) {
        return accountRepository.findByUserName(username)
                .orElse(null);
    }

    public void deleteUser(Account account) {
        sessionRepository.deleteByAccount(account);
        accountRepository.delete(account);
    }

    public void saveUser(Account account) {
        accountRepository.save(account);
    }

    public void addRecordAccount(Account account, @NotNull RecordAccount recordAccount) {
        recordAccount.setAccount(account);
        recordAccount = recordAccountRepository.save(recordAccount);
        account.getRecordAccounts().put(recordAccount.getId(), recordAccount);
        accountRepository.save(account);
    }

    public void deleteRecordAccount(@NotNull Account account, @NotNull RecordAccount recordAccount) {
        account.getRecordAccounts().remove(recordAccount.getId());
        accountRepository.save(account);
    }

    public void registerFailedAttempt(@NotNull Account account) {
        int newAttempts = account.getFailedAttempts() + 1;
        account.setFailedAttempts(newAttempts);

        if (newAttempts >= MAX_FAILED_ATTEMPTS) {
            account.setLocked(true);
            account.setLockTime(LocalDateTime.now());
        }
        accountRepository.save(account);
    }

    public boolean isAccountLocked(@NotNull Account account) {
        if (!account.isLocked()) return false;

        if (account.getLockTime().plusMinutes(LOCK_TIME_DURATION).isBefore(LocalDateTime.now())) {
            account.setLocked(false);
            account.setFailedAttempts(0);
            account.setLockTime(null);
            accountRepository.save(account);
            return false;
        }
        return true;
    }

    public void resetFailedAttempts(@NotNull Account account) {
        if (account.getFailedAttempts() > 0) {
            account.setFailedAttempts(0);
            account.setLockTime(null);
            account.setLocked(false);
            accountRepository.save(account);
        }
    }
}
