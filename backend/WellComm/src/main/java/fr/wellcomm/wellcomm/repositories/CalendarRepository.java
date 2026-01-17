package fr.wellcomm.wellcomm.repositories;

import fr.wellcomm.wellcomm.entities.Calendar;
import fr.wellcomm.wellcomm.entities.Record;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CalendarRepository extends JpaRepository<Calendar, Long> {
    List<Calendar> record(Record record);
}