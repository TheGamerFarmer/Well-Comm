package fr.wellcomm.wellcomm.services;

import fr.wellcomm.wellcomm.entities.RecordAccount;
import fr.wellcomm.wellcomm.repositories.RecordAccountRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class RecordAccountService {
    private final RecordAccountRepository recordAccountRepository;

    public RecordAccountService(RecordAccountRepository recordAccountRepository) {
        this.recordAccountRepository = recordAccountRepository;
    }

    public RecordAccount getReccordAccount(long id) {
        return recordAccountRepository.findById(id).orElse(null);
    }
}
