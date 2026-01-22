package fr.wellcomm.wellcomm.entities;

import jakarta.persistence.*;
import lombok.NoArgsConstructor;
import org.jetbrains.annotations.NotNull;

@Entity
@Table(name = "closed_channels")
@NoArgsConstructor
public class ClosedChannel extends Channel {
    public ClosedChannel(@NotNull OpenChannel channel) {
        this.title = channel.getTitle();
        this.creationDate = channel.getCreationDate();
        this.category = channel.getCategory();
        this.messages = channel.getMessages();
        this.record = channel.getRecord();
    }
}