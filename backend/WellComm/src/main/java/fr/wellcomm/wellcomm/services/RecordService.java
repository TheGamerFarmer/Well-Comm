package fr.wellcomm.wellcomm.services;

import fr.wellcomm.wellcomm.entities.*;
import fr.wellcomm.wellcomm.entities.Record;
import fr.wellcomm.wellcomm.repositories.RecordAccountRepository;
import fr.wellcomm.wellcomm.repositories.ReportRepository;
import jakarta.transaction.Transactional;
import org.jetbrains.annotations.NotNull;
import org.springframework.stereotype.Service;
import java.util.Date;

import fr.wellcomm.wellcomm.repositories.ChannelRepository;
import lombok.AllArgsConstructor;
import java.util.List;

@Service
@Transactional
@AllArgsConstructor
public class RecordService {
    private final ReportRepository recordRepository;
    private final ChannelRepository channelRepository;
    private final RecordAccountRepository recordAccountRepository;

    public Record getRecord(long id) {
        return recordRepository.findById(String.valueOf(id)).orElse(null);
    }

    public List<Record> getRecords(String userName) {
        return recordRepository.findRecordByUserUserName(userName);
    }

    public List<OpenChannel> getChannelsOfCategory(long recordId, Category category) {
        return channelRepository.findByDossierIdAndCategorie(recordId, category);
    }

    public Record createRecord(String name) {
        return recordRepository.save(new Record(name));
    }

    public void archiveChannel(Record record, long channelId) {
        OpenChannel channel = channelRepository.findById(channelId).orElse(null);
        if (channel == null)
            return;

        CloseChannel closeChannel = new CloseChannel(channel);

        channel.getMessages().forEach(message -> message.setChannel(closeChannel));

        record.getOpenChannels().remove(channel);
        record.getCloseChannels().add(closeChannel);

        recordRepository.save(record);
    }

    public OpenChannel createChannel(@NotNull Record record, String title, Category category, String content, String userName) {
        String userTitle = recordAccountRepository
                .findByAccountUserNameAndRecordId(userName, record.getId())
                .map(RecordAccount::getTitle)
                .orElse("Membre");

        OpenChannel channel = new OpenChannel(title,
                new Date(),
                category,
                record);

        Message firstMessage = new Message(content,
                new Date(),
                userName,
                userTitle,
                channel);

        channel.getMessages().add(firstMessage);
        record.getOpenChannels().add(channel);

        recordRepository.save(record);

        return record.getOpenChannels().getLast();
    }
}