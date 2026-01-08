package fr.wellcomm.wellcomm.entities;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "opened_channels")
@Getter
@Setter
@NoArgsConstructor
public class OpenChannel extends Channel {
    @OneToMany(mappedBy = "channel", cascade = CascadeType.ALL)
    protected List<Message> messages = new ArrayList<>();

    public OpenChannel(String title, Date creationDate, Category category, Record record) {
        this.title = title;
        this.creationDate = creationDate;
        this.category = category;
        this.record = record;
    }
}
