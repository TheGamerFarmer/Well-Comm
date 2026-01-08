package fr.wellcomm.wellcomm.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.jetbrains.annotations.NotNull;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "closed_channels")
@Getter
@Setter
@NoArgsConstructor
public class CloseChannel extends Channel {
    @OneToMany(mappedBy = "channel", cascade = CascadeType.ALL)
    protected List<Message> messages = new ArrayList<>();

    public CloseChannel(@NotNull OpenChannel channel) {
        this.title = channel.getTitle();
        this.creationDate = channel.getCreationDate();
        this.category = channel.getCategory();
        this.messages = channel.getMessages();
        this.record = channel.getRecord();
    }
}