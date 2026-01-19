package fr.wellcomm.wellcomm.services;

import fr.wellcomm.wellcomm.domain.Category;
import fr.wellcomm.wellcomm.entities.*;
import fr.wellcomm.wellcomm.entities.Record;
import fr.wellcomm.wellcomm.repositories.RecordAccountRepository;
import fr.wellcomm.wellcomm.repositories.ReportRepository;
import jakarta.transaction.Transactional;
import org.jetbrains.annotations.NotNull;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import fr.wellcomm.wellcomm.repositories.ChannelRepository;
import lombok.AllArgsConstructor;
import java.util.List;
import java.util.Optional;

<<<<<<< HEAD
import static java.time.LocalDate.now;
import static org.springframework.data.util.ClassUtils.ifPresent;

=======
>>>>>>> main
@Service
@Transactional
@AllArgsConstructor
public class RecordService {
    private final ReportRepository recordRepository;
    private final ChannelRepository channelRepository;
    private final RecordAccountRepository recordAccountRepository;
    private final ChannelService channelService;
    private final CalendarService calendarService;

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

    public List<OpenChannel> getLastWeekChannelsOfCategory(long recordId, Category category) {
        List<OpenChannel> channels = channelRepository.findByDossierIdAndCategorie(recordId, category);
        List<OpenChannel> lastWeekChannels = new ArrayList<>();
        Date oneWeekAgo = Date.from(LocalDateTime.now().minusDays(7).atZone(ZoneId.systemDefault()).toInstant());
        for (OpenChannel channel : channels) {
            Date lastMessageDate = channelService.lastMessage(channel);
            if (lastMessageDate != null && lastMessageDate.after(oneWeekAgo)) {
                lastWeekChannels.add(channel);
            }
        }
        return lastWeekChannels;
    }

    public Record createRecord(String name, String admin) {
        Record record = new Record(name, admin);

        record = recordRepository.save(record);

        Calendar calendar = calendarService.createCalendar(record);
        record.setCalendar(calendar);
        record = recordRepository.save(record);

        return record;
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
        OpenChannel channel = channelRepository.findById(channelId).orElse(null);
        if (channel == null)
            return;

        CloseChannel closeChannel = new CloseChannel(channel);

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