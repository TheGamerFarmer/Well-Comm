package fr.wellcomm.wellcomm.services;

import fr.wellcomm.wellcomm.domain.Category;
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
import java.util.Optional;

import static org.springframework.data.util.ClassUtils.ifPresent;

@Service
@Transactional
@AllArgsConstructor
public class RecordService {
    private final ReportRepository recordRepository;
    private final ChannelRepository channelRepository;
    private final RecordAccountRepository recordAccountRepository;
    private final ChannelService channelService;

    public Record getRecord(long id) {
        return recordRepository.findById(String.valueOf(id)).orElse(null);
    }

    public RecordAccount getRecordAccount(@NotNull Record record, @NotNull Account user) {
        return recordAccountRepository.findByAccountUserNameAndRecordId(user.getUserName(), record.getId()).orElse(null);
    }

    public List<Record> getRecords(String userName) {
        return recordRepository.findRecordByUserUserName(userName);
    }

    public List<OpenChannel> getChannelsOfCategory(long recordId, Category category) {
        return channelRepository.findByDossierIdAndCategorie(recordId, category);
    }

    public List<CloseChannel> getChannelsOfCategoryClose(long recordId, Category category) {
        return channelRepository.findByDossierIdAndCategorieClose(recordId, category);
    }

    public Record createRecord(String name) {
        return recordRepository.save(new Record(name));
    }

    @Transactional
    public boolean deleteRecord(Long id) {
        Optional<Record> recordOpt = recordRepository.findById(String.valueOf(id));

        if (recordOpt.isEmpty()) {
            return false;
        }

        recordRepository.delete(recordOpt.get()); // cascade JPA supprime les enfants
        return true;
    }
    public void archiveChannel(Record record, long channelId) {
        Channel channel = channelRepository.findById(channelId).orElse(null);
        if (channel == null)
            return;

        CloseChannel closeChannel = new CloseChannel((OpenChannel) channel);

        channel.getMessages().values().forEach(message -> message.setChannel(closeChannel));

        record.getOpenChannels().remove(channel.getId());
        record.getCloseChannels().put(closeChannel.getId(), closeChannel);

        recordRepository.save(record);
    }

    public OpenChannel createChannel(@NotNull Record record, String title, Category category, String content, Account account) {
        OpenChannel channel = new OpenChannel(title,
                new Date(),
                category,
                record);

        channelService.addMessage(channel, content, account);
        record.getOpenChannels().put(channel.getId(), channel);

        recordRepository.save(record);

        return channel;
    }
}