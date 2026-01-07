package fr.wellcomm.wellcomm.security;

import fr.wellcomm.wellcomm.repositories.SessionRepository;
import jakarta.annotation.Nonnull;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;

@Component
@AllArgsConstructor
public class TokenFilter extends OncePerRequestFilter {
    private final SessionRepository sessionRepository;

    @Override
    protected void doFilterInternal(@NotNull HttpServletRequest request, @Nonnull HttpServletResponse response, @Nonnull FilterChain filterChain)
            throws ServletException, IOException {

        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);

            sessionRepository.findById(token).ifPresent(session -> {
                if (session.getExpirationDate().isAfter(LocalDateTime.now())) {

                    UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                            session.getAccount().getUserName(), null, new ArrayList<>()
                    );
                    SecurityContextHolder.getContext().setAuthentication(auth);
                }
            });
        }

        filterChain.doFilter(request, response);
    }
}