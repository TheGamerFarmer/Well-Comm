package fr.wellcomm.wellcomm.services;

import fr.wellcomm.wellcomm.domain.Permission;
import fr.wellcomm.wellcomm.entities.Account;
import fr.wellcomm.wellcomm.entities.Record;
import fr.wellcomm.wellcomm.entities.RecordAccount;
import fr.wellcomm.wellcomm.domain.Role;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;
import java.util.ArrayList;
import java.util.List;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
public class AccountServiceTest {
    @Autowired private AccountService accountService;
    @Autowired private RecordService recordService;

    @Test
    void testAccount() {
        // 1. Test Save & Get
        Account user = new Account();
        user.setUserName("testUser");
        accountService.saveUser(user);

        Account found = accountService.getUser(user.getId());
        assertNotNull(found);

        // 2. Test RecordAccount
        Record record = recordService.createRecord("Dossier A", user);
        RecordAccount ra = new RecordAccount(user, record, Role.AIDANT);

        accountService.addRecordAccount(user, ra);
        assertEquals(1, found.getRecordAccounts().size());

        // 3. Test Delete RecordAccount
        accountService.deleteRecordAccount(user, ra);
        assertEquals(0, found.getRecordAccounts().size());

        // 4. Test Delete User
        accountService.deleteUser(user);
        assertNull(accountService.getUser(user.getId()));
    }
}