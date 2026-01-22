package fr.wellcomm.wellcomm.entities;

import fr.wellcomm.wellcomm.domain.Category;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.NoArgsConstructor;
import java.util.*;

@Entity
@Table(name = "opened_channels")
@NoArgsConstructor
public class OpenChannel extends Channel {
    public OpenChannel(String title, Date creationDate, Category category, Record record) {
        this.title = title;
        this.creationDate = creationDate;
        this.category = category;
        this.record = record;
    }
}
