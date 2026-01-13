package fr.wellcomm.wellcomm.services;

import com.github.sardine.Sardine;
import fr.wellcomm.wellcomm.config.FramagendaConfig;
import fr.wellcomm.wellcomm.domain.EventDTO;
import lombok.AllArgsConstructor;
import org.apache.http.auth.AuthScope;
import org.apache.http.auth.UsernamePasswordCredentials;
import org.apache.http.client.CredentialsProvider;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpEntityEnclosingRequestBase;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.BasicCredentialsProvider;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.springframework.stereotype.Service;
import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.util.Calendar;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class CalendarService {
    private final FramagendaConfig config;
    private final Sardine sardine;

    public void createCalendar(long id, String displayName) {
        String url = config.getBaseUrl() + id + "/";

        // 1. On configure l'auth proprement
        CredentialsProvider provider = new BasicCredentialsProvider();
        provider.setCredentials(AuthScope.ANY,
                new UsernamePasswordCredentials(config.getUsername(), config.getPassword()));

        try (CloseableHttpClient client = HttpClients.custom()
                .setDefaultCredentialsProvider(provider).build()) {

            // 2. On définit manuellement le verbe MKCALENDAR
            HttpEntityEnclosingRequestBase mkcalendarRequest = new HttpEntityEnclosingRequestBase() {
                @Override
                public String getMethod() {
                    return "MKCALENDAR";
                }
            };
            mkcalendarRequest.setURI(URI.create(url));

            // 3. Le corps XML pour définir le nom affiché
            String body = "<?xml version=\"1.0\" encoding=\"utf-8\" ?>" +
                    "<C:mkcalendar xmlns:D=\"DAV:\" xmlns:C=\"urn:ietf:params:xml:ns:caldav\">" +
                    "  <D:set><D:prop><D:displayname>" + displayName + "</D:displayname></D:prop></D:set>" +
                    "</C:mkcalendar>";

            mkcalendarRequest.setEntity(new StringEntity(body, "UTF-8"));
            mkcalendarRequest.setHeader("Content-Type", "text/xml; charset=utf-8");

            // 4. On exécute
            try (CloseableHttpResponse response = client.execute(mkcalendarRequest)) {
                int code = response.getStatusLine().getStatusCode();
                if (code == 201) System.out.println("Agenda créé avec succès !");
                else if (code == 405) System.out.println("L'agenda existe déjà.");
                else System.err.println("❌ Erreur HTTP " + code + " : " + response.getStatusLine().getReasonPhrase());
            }
        } catch (IOException ex) {
            Logger.getGlobal().log(Level.SEVERE, "Cannot create calendar", ex);
        }
    }

    public List<EventDTO> getEvents(long id) throws Exception {
        String url = "https://framagenda.org/remote.php/dav/calendars/USER/" + id + "/?export";

        InputStream is = sardine.get(url);
        Calendar calendar = new CalendarBuilder().build(is);

        // On convertit les VEVENT en un DTO simple pour le JSON
        return calendar.getComponents(VEvent.VEVENT).stream().map(component -> {
            VEvent event = (VEvent) component;
            return new EventDTO(
                    event.getSummary().getValue(),
                    event.getStartDate().getDate(),
                    event.getEndDate().getDate()
            );
        }).collect(Collectors.toList());
    }
}