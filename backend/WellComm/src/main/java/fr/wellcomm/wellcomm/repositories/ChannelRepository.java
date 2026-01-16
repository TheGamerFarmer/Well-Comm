package fr.wellcomm.wellcomm.repositories;

import fr.wellcomm.wellcomm.domain.Category;
import fr.wellcomm.wellcomm.entities.CloseChannel;
import fr.wellcomm.wellcomm.entities.OpenChannel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChannelRepository extends JpaRepository<OpenChannel, Long> {
    // JpaRepository contient déjà les méthodes : findById, save, findAll, etc.

    /**
     * On cherche les fils liés au dossier ID dont la catégorie est celle passée en paramètre
     * @param recordId
     * @param category
     * @return
     */
    @Query("SELECT channels FROM Record record JOIN record.openChannels channels WHERE record.id = :recordId AND channels.category = :category")
    List<OpenChannel> findByDossierIdAndCategorie(@Param("recordId") Long recordId, @Param("category") Category category);

    @Query("SELECT channels FROM Record record JOIN record.closeChannels channels WHERE record.id = :recordId AND channels.category = :category")
    List<CloseChannel> findByDossierIdAndCategorieClose(@Param("recordId") Long recordId, @Param("category") Category category);
}