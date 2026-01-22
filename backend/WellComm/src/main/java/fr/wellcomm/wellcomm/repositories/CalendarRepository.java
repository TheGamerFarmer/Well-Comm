package fr.wellcomm.wellcomm.repositories;

import fr.wellcomm.wellcomm.entities.Calendar;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CalendarRepository extends JpaRepository<Calendar, Long> {
}