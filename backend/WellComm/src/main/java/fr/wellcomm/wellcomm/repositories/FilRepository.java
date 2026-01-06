package fr.wellcomm.wellcomm.repositories;

import fr.wellcomm.wellcomm.entities.Categorie;
import fr.wellcomm.wellcomm.entities.Fil;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FilRepository extends JpaRepository<Fil, Long> {
    // JpaRepository contient déjà les méthodes : findById, save, findAll, etc.

    // On cherche les fils liés au dossier ID dont la catégorie est celle passée en paramètre
    @Query("SELECT f FROM Dossier d JOIN d.fils f WHERE d.id = :dossierId AND f.categorie = :categorie")
    List<Fil> findByDossierIdAndCategorie(@Param("dossierId") Long dossierId, @Param("categorie") Categorie categorie);


}