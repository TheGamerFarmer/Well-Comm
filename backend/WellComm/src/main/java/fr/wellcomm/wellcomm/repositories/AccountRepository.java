package fr.wellcomm.wellcomm.repositories;

import fr.wellcomm.wellcomm.entities.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AccountRepository extends JpaRepository<Account, String> {
    // JpaRepository contient déjà les méthodes : findById, save, findAll, etc.
}