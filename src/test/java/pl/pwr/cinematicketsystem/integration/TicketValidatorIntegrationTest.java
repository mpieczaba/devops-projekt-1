package pl.pwr.cinematicketsystem.integration;

import static org.hamcrest.Matchers.is;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.httpBasic;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.Clock;
import java.time.LocalDateTime;
import java.time.ZoneId;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.Primary;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;

@TestConfiguration
class FixedClockTestConfig {

    static final LocalDateTime FIXED_NOW = LocalDateTime.of(2026, 5, 27, 17, 50);

    @Bean
    @Primary
    Clock testClock() {
        return Clock.fixed(FIXED_NOW.atZone(ZoneId.systemDefault()).toInstant(), ZoneId.systemDefault());
    }
}

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@Import(FixedClockTestConfig.class)
class TicketValidatorIntegrationTest extends AbstractIntegrationTest {

    private String reservationCode;
    private String redeemReservationCode;

    @BeforeAll
    void seedReservations() throws Exception {
        reservationCode = createReservation(1, "[5, 6]");
        redeemReservationCode = createReservation(4, "[7, 8]");
    }

    @Test
    void ticketValidatorEndpointsRequireAuthentication() throws Exception {
        mockMvc
            .perform(get("/ticket-validators/info").param("code", reservationCode))
            .andExpect(status().isUnauthorized());
    }

    @Test
    void getInfo_returnsValidReservationDetails() throws Exception {
        mockMvc
            .perform(
                get("/ticket-validators/info")
                    .param("code", reservationCode)
                    .with(httpBasic("a", "p"))
            )
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.reservationCode", is(reservationCode)))
            .andExpect(jsonPath("$.ticketState", is("VALID")))
            .andExpect(jsonPath("$.numberOfReservedSeats", is(2)))
            .andExpect(jsonPath("$.roomId", is(1)))
            .andExpect(jsonPath("$.reservedSeats", org.hamcrest.Matchers.hasSize(2)));
    }

    @Test
    void scanTicket_redeemsValidReservation() throws Exception {
        mockMvc
            .perform(
                post("/ticket-validators/scan-ticket")
                    .param("code", redeemReservationCode)
                    .with(httpBasic("a", "p"))
            )
            .andExpect(status().isOk());

        mockMvc
            .perform(
                get("/ticket-validators/info")
                    .param("code", redeemReservationCode)
                    .with(httpBasic("a", "p"))
            )
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.ticketState", is("USED")));
    }

    @Test
    void getInfo_returnsNotFoundForUnknownCode() throws Exception {
        mockMvc
            .perform(
                get("/ticket-validators/info")
                    .param("code", "RES-NOT-REAL")
                    .with(httpBasic("a", "p"))
            )
            .andExpect(status().isNotFound());
    }

    private String createReservation(int showId, String seatIdsJson) throws Exception {
        MvcResult result = mockMvc
            .perform(
                post("/reservations")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""
                        {
                          "showId": %d,
                          "seatIds": %s
                        }
                        """.formatted(showId, seatIdsJson))
            )
            .andExpect(status().isOk())
            .andReturn();

        return com.jayway.jsonpath.JsonPath.read(result.getResponse().getContentAsString(), "$.code");
    }
}
