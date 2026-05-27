package pl.pwr.cinematicketsystem.integration;

import static org.hamcrest.Matchers.greaterThanOrEqualTo;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledIf;

@EnabledIf("pl.pwr.cinematicketsystem.integration.PostgresTestContainer#isDockerAvailable")
class RepertoireIntegrationTest extends AbstractIntegrationTest {

    @Test
    void getMovies_returnsSeededCatalog() throws Exception {
        mockMvc
            .perform(get("/movies"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$", hasSize(3)))
            .andExpect(jsonPath("$[0].title").exists())
            .andExpect(jsonPath("$[0].durationMinutes").isNumber());
    }

    @Test
    void getShows_returnsSeededShowtimes() throws Exception {
        mockMvc
            .perform(get("/shows"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(4))))
            .andExpect(jsonPath("$[0].movieId").exists())
            .andExpect(jsonPath("$[0].roomId").exists());
    }

    @Test
    void getSeatsForShow_returnsSeatMap() throws Exception {
        mockMvc
            .perform(get("/shows/1/seats"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(6))))
            .andExpect(jsonPath("$[0].seatId").exists())
            .andExpect(jsonPath("$[0].reserved").exists());
    }
}
