package fr.wellcomm.wellcomm.services;

import fr.wellcomm.wellcomm.entities.*;
import fr.wellcomm.wellcomm.repositories.AccountRepository;
import fr.wellcomm.wellcomm.repositories.MessageRepository;
import fr.wellcomm.wellcomm.repositories.RecordAccountRepository;
import fr.wellcomm.wellcomm.repositories.ChannelRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.stereotype.Service;
import java.util.Date;
import java.util.List;
import java.util.Map;

@Service
@Transactional
@AllArgsConstructor
public class ChannelService {
    private final ChannelRepository channelRepository;
    private final RecordAccountRepository recordAccountRepository;
    private final MessageRepository messageRepository;
    private final AccountRepository accountRepository;

    public OpenChannel getChannel(long id) {
        return channelRepository.findById(id).orElse(null);
    }

    public Message addMessage(@NotNull OpenChannel channel, String content, @NotNull Account account) {
        accountRepository.findById(account.getUserName())
                .orElseGet(() -> accountRepository.save(account));

        if (channel.getId() == 0) {
            channel = channelRepository.save(channel);
        }

        String userTitle = recordAccountRepository
                .findByAccountUserNameAndRecordId(account.getUserName(), channel.getRecord().getId())
                .map(RecordAccount::getTitle)
                .orElse("Membre");

        Message message = new Message(content,
                new Date(),
                account,
                userTitle,
                channel);

        message = messageRepository.save(message);

        channel.getMessages().put(message.getId(), message);

        channelRepository.save(channel);

        return message;
    }

    public Date lastMessage(@NotNull OpenChannel channel) {
        Map<Long, Message> messages = channel.getMessages();
        Date lastMessage = null;
        for (Message message : messages.values()) {
            if(lastMessage == null || lastMessage.getTime() < message.getDate().getTime()) {
                lastMessage = message.getDate();
            }
        }
        return lastMessage;
    }
}
