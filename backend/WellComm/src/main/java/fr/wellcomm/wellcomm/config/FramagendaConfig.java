package fr.wellcomm.wellcomm.config;

import com.github.sardine.Sardine;
import com.github.sardine.SardineFactory;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "framagenda")
@Data
public class FramagendaConfig {
    private String username;
    private String password;
    private String baseUrl;

    @Bean
    public Sardine sardine() {
        return SardineFactory.begin(username, password);
    }
}
