package fr.wellcomm.wellcomm.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "framagenda")
@Data
public class FramagendaConfig {
    private String username;
    private String password;
    private String baseUrl;
}
