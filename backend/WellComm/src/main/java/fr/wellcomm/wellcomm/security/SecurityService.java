package fr.wellcomm.wellcomm.security;

import fr.wellcomm.wellcomm.domain.Permission;
import fr.wellcomm.wellcomm.entities.*;
import fr.wellcomm.wellcomm.entities.Record;
import fr.wellcomm.wellcomm.services.*;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.HandlerMapping;
import java.util.Map;

@Service("securityService")
@SuppressWarnings("unused")
@AllArgsConstructor
public class SecurityService {
    private final AccountService accountService;
    private final RecordService recordService;
    private final ChannelService channelService;
    private final MessageService messageService;
    private final HttpServletRequest request;
    private final EventService eventService;

    private boolean hasPermission(Account account, Record record, Permission permission) {
        RecordAccount recordAccount = recordService.getRecordAccount(record, account);
        if (recordAccount == null)
            return false;

        return recordAccount.getPermissions().contains(permission);
    }

    public boolean hasRecordPermission(Permission permission) {
        Map<String, String> params = getPathVars();
        Account account = accountService.getUser(params.get("userName"));
        if (account == null)
            return false;

        Record record = recordService.getRecord(Long.parseLong(params.get("recordId")));
        if (record == null)
            return false;

        return hasPermission(account, record, permission);
    }

    public boolean hasChannelPermission(Permission permission) {
        Map<String, String> params = getPathVars();
        Account account = accountService.getUser(params.get("userName"));
        if (account == null)
            return false;

        OpenChannel channel = channelService.getChannel(Long.parseLong(params.get("channelId")));
        if (channel == null)
            return false;

        Record record = channel.getRecord();
        if (record.getId() != Long.parseLong(params.get("recordId")))
            return false;

        return hasPermission(account, record, permission);
    }

    public boolean hasMessagePermission(Permission permission) {
        Map<String, String> params = getPathVars();
        Account account = accountService.getUser(params.get("userName"));
        if (account == null)
            return false;

        Message message = messageService.getMessage(Long.parseLong(params.get("channelId")));
        if (message == null)
            return false;

        Channel channel = message.getChannel();
        if (channel.getId() != Long.parseLong(params.get("channelId")))
            return false;

        Record record = channel.getRecord();
        if (record.getId() != Long.parseLong(params.get("recordId")))
            return false;

        return hasPermission(account, record, permission);
    }

    public boolean hasEventPermission(Permission permission) {
        Map<String, String> params = getPathVars();
        Account account = accountService.getUser(params.get("userName"));
        if (account == null)
            return false;

        Event event = eventService.getEvent(Long.parseLong(params.get("eventId")));
        if (event == null)
            return false;

        Calendar calendar = event.getCalendar();
        if (calendar.getId() != Long.parseLong(params.get("recordId")))
            return false;

        return hasPermission(account, calendar.getRecord(), permission);
    }

    public boolean ownMessage() {
        Map<String, String> params = getPathVars();
        Account account = accountService.getUser(params.get("userName"));
        if (account == null)
            return false;

        Message message = messageService.getMessage(Long.parseLong(params.get("channelId")));
        if (message == null)
            return false;

        return message.getAuthor().getUserName().equals(account.getUserName());
    }

    public boolean isAdmin() {
        Map<String, String> params = getPathVars();
        Account account = accountService.getUser(params.get("userName"));
        if (account == null)
            return false;

        Record record = recordService.getRecord(Long.parseLong(params.get("recordId")));
        if (record == null)
            return false;

        return hasPermission(account, record, Permission.IS_ADMIN);
    }

    @SuppressWarnings("unchecked")
    private Map<String, String> getPathVars() {
        return (Map<String, String>) request.getAttribute(HandlerMapping.URI_TEMPLATE_VARIABLES_ATTRIBUTE);
    }
}
