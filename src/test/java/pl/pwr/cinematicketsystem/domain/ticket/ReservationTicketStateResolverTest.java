package pl.pwr.cinematicketsystem.domain.ticket;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.List;

import org.junit.jupiter.api.Test;

import pl.pwr.cinematicketsystem.entity.Ticket;
import pl.pwr.cinematicketsystem.entity.TicketState;

class ReservationTicketStateResolverTest {

    private final ReservationTicketStateResolver resolver = new ReservationTicketStateResolver();

    @Test
    void resolve_returnsUsed_whenAllUsed() {
        TicketState state = resolver.resolve(
            List.of(ticket(TicketState.USED), ticket(TicketState.USED))
        );

        assertEquals(TicketState.USED, state);
    }

    @Test
    void resolve_returnsValid_whenAnyValid() {
        TicketState state = resolver.resolve(
            List.of(ticket(TicketState.USED), ticket(TicketState.VALID))
        );

        assertEquals(TicketState.VALID, state);
    }

    @Test
    void resolve_returnsInvalid_whenNoneValidOrUsed() {
        TicketState state = resolver.resolve(
            List.of(ticket(TicketState.INVALID), ticket(TicketState.INVALID))
        );

        assertEquals(TicketState.INVALID, state);
    }

    private Ticket ticket(TicketState state) {
        Ticket ticket = new Ticket();
        ticket.setState(state);
        return ticket;
    }
}
