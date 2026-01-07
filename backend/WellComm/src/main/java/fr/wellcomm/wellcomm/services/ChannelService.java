package fr.wellcomm.wellcomm.services;

import fr.wellcomm.wellcomm.entities.OpenChannel;
import fr.wellcomm.wellcomm.entities.RecordAccount;
import fr.wellcomm.wellcomm.entities.Message;
import fr.wellcomm.wellcomm.repositories.RecordAccountRepository;
import fr.wellcomm.wellcomm.repositories.ChannelRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.stereotype.Service;
import java.util.Date;
import java.util.List;

@Service
@Transactional
@AllArgsConstructor
public class ChannelService {
    private final ChannelRepository channelRepository;
    private final RecordAccountRepository recordAccountRepository;

    public OpenChannel getChannel(long id) {
        return channelRepository.findById(id).orElse(null);
    }

    public Message getLastMessage(OpenChannel channel) {
        if (channel == null)
            return null;

        List<Message> messages = channel.getMessages();

        if (messages == null || messages.isEmpty())
            return null;

        return messages.getLast();
    }

    public Message addMessage(@NotNull OpenChannel channel, String content, String userName) {
        String userTitle = recordAccountRepository
                .findByAccountUserNameAndRecordId(userName, channel.getRecord().getId())
                .map(RecordAccount::getTitle)
                .orElse("Membre");

        Message message = new Message(content,
                new Date(),
                userName,
                userTitle,
                channel);

        channel.getMessages().add(message);

        channelRepository.save(channel);

        return message;
    }
}
