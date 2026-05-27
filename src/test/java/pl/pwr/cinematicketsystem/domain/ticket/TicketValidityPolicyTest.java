package pl.pwr.cinematicketsystem.domain.ticket;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.time.LocalDateTime;
import java.util.List;

import org.junit.jupiter.api.Test;

import pl.pwr.cinematicketsystem.entity.Movie;
import pl.pwr.cinematicketsystem.entity.Show;
import pl.pwr.cinematicketsystem.entity.Ticket;
import pl.pwr.cinematicketsystem.entity.TicketState;

class TicketValidityPolicyTest {

    private final TicketValidityPolicy policy = new TicketValidityPolicy();

    @Test
    void resolveState_returnsValid_withinWindow() {
        Show show = showAt(LocalDateTime.of(2026, 5, 27, 18, 0), 120);
        Ticket ticket = ticketWithShow(show, null);

        TicketState state = policy.resolveState(
            ticket,
            LocalDateTime.of(2026, 5, 27, 17, 50, 0)
        );

        assertEquals(TicketState.VALID, state);
    }

    @Test
    void resolveState_returnsInvalid_beforeWindow() {
        Show show = showAt(LocalDateTime.of(2026, 5, 27, 18, 0), 120);
        Ticket ticket = ticketWithShow(show, null);

        TicketState state = policy.resolveState(
            ticket,
            LocalDateTime.of(2026, 5, 27, 17, 44, 0)
        );

        assertEquals(TicketState.INVALID, state);
    }

    @Test
    void resolveState_keepsUsed() {
        Show show = showAt(LocalDateTime.of(2026, 5, 27, 18, 0), 120);
        Ticket ticket = ticketWithShow(show, TicketState.USED);

        TicketState state = policy.resolveState(
            ticket,
            LocalDateTime.of(2026, 5, 27, 17, 50, 0)
        );

        assertEquals(TicketState.USED, state);
    }

    private Show showAt(LocalDateTime date, int durationMinutes) {
        Movie movie = Movie.builder().durationMinutes(durationMinutes).build();
        Show show = new Show();
        show.setDate(date);
        show.setMovie(movie);
        return show;
    }

    private Ticket ticketWithShow(Show show, TicketState state) {
        Ticket ticket = new Ticket();
        ticket.setShow(show);
        ticket.setState(state);
        return ticket;
    }
}
