package fr.wellcomm.wellcomm.services;

import fr.wellcomm.wellcomm.entities.Account;
import fr.wellcomm.wellcomm.entities.OpenChannel;
import fr.wellcomm.wellcomm.entities.RecordAccount;
import fr.wellcomm.wellcomm.entities.Message;
import fr.wellcomm.wellcomm.repositories.MessageRepository;
import fr.wellcomm.wellcomm.repositories.RecordAccountRepository;
import fr.wellcomm.wellcomm.repositories.ChannelRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.stereotype.Service;
import java.util.Date;

@Service
@Transactional
@AllArgsConstructor
public class ChannelService {
    private final ChannelRepository channelRepository;
    private final RecordAccountRepository recordAccountRepository;
    private final MessageRepository messageRepository;

    public OpenChannel getChannel(long id) {
        return channelRepository.findById(id).orElse(null);
    }

    public Message addMessage(@NotNull OpenChannel channel, String content, @NotNull Account account) {
        if (channel.getId() == 0) {
            channel = channelRepository.save(channel);
        }

        String userTitle = recordAccountRepository
                .findByAccountUserNameAndRecordId(account.getUserName(), channel.getRecord().getId())
                .map(RecordAccount::getTitle)
                .orElse("Membre");

        Message message = new Message(content,
                new Date(),
                account.getUserName(),
                userTitle,
                channel);

        message = messageRepository.save(message);

        channel.getMessages().put(message.getId(), message);

        channelRepository.save(channel);

        return message;
    }
}
