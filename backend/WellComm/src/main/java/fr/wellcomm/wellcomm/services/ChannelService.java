package fr.wellcomm.wellcomm.services;

import fr.wellcomm.wellcomm.entities.Account;
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

@Service
@Transactional
@AllArgsConstructor
public class ChannelService {
    private final ChannelRepository channelRepository;
    private final RecordAccountRepository recordAccountRepository;

    public OpenChannel getChannel(long id) {
        return channelRepository.findById(id).orElse(null);
    }

    public Message addMessage(@NotNull OpenChannel channel, String content, @NotNull Account account) {
        String userTitle = recordAccountRepository
                .findByAccountUserNameAndRecordId(account.getUserName(), channel.getRecord().getId())
                .map(RecordAccount::getTitle)
                .orElse("Membre");

        Message message = new Message(content,
                new Date(),
                account,
                userTitle,
                channel);

        channel.getMessages().put(message.getId(), message);

        channelRepository.save(channel);

        return message;
    }
}
