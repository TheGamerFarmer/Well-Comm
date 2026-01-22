package fr.wellcomm.wellcomm.services;

import fr.wellcomm.wellcomm.domain.Role;
import fr.wellcomm.wellcomm.entities.Record;
import fr.wellcomm.wellcomm.entities.*;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
public class RecordAccountServiceTest {
    @Autowired private RecordService recordService;
    @Autowired private RecordAccountService recordAccountService;
    private Record testRecord;

    @Test
    void testRecordAccountService() {
        Account testUser = new Account();
        testUser.setUserName("userTest");
        testRecord = recordService.createRecord("Dossier Global", 1);

        //1. test createRecordAccount
        RecordAccount recordAccount = recordAccountService.createReccordAccount(testUser, testRecord, Role.AIDANT);
        assertEquals(testRecord.getId(), recordAccount.getRecord().getId());
        assertEquals(Role.AIDANT.getTitre(), recordAccount.getTitle());

        //2. test getByRecordId
        List<RecordAccount> recordsaccount = recordAccountService.getByRecordId(testRecord.getId());
        assertEquals(1, recordsaccount.size());

        //3. test getRecordAccount
        RecordAccount recordAccount2 = recordAccountService.getRecordAccount(testUser.getId(), testRecord.getId());
        assertEquals(recordAccount, recordAccount2);

        //4. test updateRoleRecordAccount
        recordAccountService.updateRoleRecordAccount(testUser.getUserName(), testRecord.getId(), Role.EMPLOYEE);
        assertEquals(Role.EMPLOYEE.getTitre(), recordAccount.getTitle());
    }

}