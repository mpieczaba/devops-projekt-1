package pl.pwr.cinematicketsystem.security;

import javax.sql.DataSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.provisioning.JdbcUserDetailsManager;
import org.springframework.security.provisioning.UserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public UserDetailsManager userDetailsManager(DataSource dataSource) {
        return new JdbcUserDetailsManager(dataSource);
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(Customizer.withDefaults())
            .authorizeHttpRequests(auth ->
                auth
//                    .requestMatchers(HttpMethod.GET, "/shows/*/seats")
//                    .hasRole("TICKET_VALIDATOR")
                    .requestMatchers(HttpMethod.GET, "/ticket-validators/info")
                    .hasRole("TICKET_VALIDATOR")
                    .requestMatchers(HttpMethod.GET, "/tickets/valid")
                    .hasRole("TICKET_VALIDATOR")
                    .requestMatchers(
                        HttpMethod.POST,
                        "/ticket-validators/scan-ticket"
                    )
                    .hasRole("TICKET_VALIDATOR")
                    .anyRequest()
                    .permitAll()
            )
            .httpBasic(Customizer.withDefaults());

        return http.build();
    }
}
