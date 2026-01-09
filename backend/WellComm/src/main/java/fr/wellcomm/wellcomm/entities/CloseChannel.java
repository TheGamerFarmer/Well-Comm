package fr.wellcomm.wellcomm.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.jetbrains.annotations.NotNull;

@Entity
@Table(name = "closed_channels")
@Getter
@Setter
@NoArgsConstructor
public class CloseChannel extends Channel {
    public CloseChannel(@NotNull OpenChannel channel) {
        this.id = channel.getId();
        this.title = channel.getTitle();
        this.creationDate = channel.getCreationDate();
        this.category = channel.getCategory();
        this.messages = channel.getMessages();
        this.record = channel.getRecord();
    }
}