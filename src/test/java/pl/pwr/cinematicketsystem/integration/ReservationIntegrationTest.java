package pl.pwr.cinematicketsystem.integration;

import static org.hamcrest.Matchers.startsWith;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledIf;
import org.springframework.http.MediaType;

@EnabledIf("pl.pwr.cinematicketsystem.integration.PostgresTestContainer#isDockerAvailable")
class ReservationIntegrationTest extends AbstractIntegrationTest {

    @Test
    void createReservation_returnsUniqueCode() throws Exception {
        mockMvc
            .perform(
                post("/reservations")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""
                        {
                          "showId": 1,
                          "seatIds": [1, 2]
                        }
                        """)
            )
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").exists())
            .andExpect(jsonPath("$.code", startsWith("RES-")));
    }

    @Test
    void createReservation_rejectsAlreadyReservedSeat() throws Exception {
        mockMvc
            .perform(
                post("/reservations")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""
                        {
                          "showId": 1,
                          "seatIds": [3]
                        }
                        """)
            )
            .andExpect(status().isOk());

        mockMvc
            .perform(
                post("/reservations")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""
                        {
                          "showId": 1,
                          "seatIds": [3]
                        }
                        """)
            )
            .andExpect(status().isConflict());
    }

    @Test
    void reservedSeatAppearsAsTakenInSeatMap() throws Exception {
        mockMvc
            .perform(
                post("/reservations")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("""
                        {
                          "showId": 2,
                          "seatIds": [4]
                        }
                        """)
            )
            .andExpect(status().isOk());

        mockMvc
            .perform(get("/shows/2/seats"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[?(@.seatId == 4 && @.reserved == true)]").isNotEmpty());
    }
}
