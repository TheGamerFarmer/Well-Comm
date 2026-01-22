package fr.wellcomm.wellcomm.repositories;

import fr.wellcomm.wellcomm.entities.Record;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ReportRepository extends JpaRepository<Record, String> {
    @Query("SELECT recordAccount.record FROM RecordAccount recordAccount WHERE recordAccount.account.id = :userId")
    List<Record> findRecordByUserId(@Param("userId") long userId);
}