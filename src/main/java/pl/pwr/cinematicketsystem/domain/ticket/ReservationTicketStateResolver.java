package pl.pwr.cinematicketsystem.domain.ticket;

import java.util.List;
import org.springframework.stereotype.Component;
import pl.pwr.cinematicketsystem.entity.Ticket;
import pl.pwr.cinematicketsystem.entity.TicketState;

/**
 * Aggregates individual ticket states into a single reservation-level state.
 */
@Component
public class ReservationTicketStateResolver {

    public TicketState resolve(List<Ticket> tickets) {
        boolean allUsed = tickets.stream().allMatch(t -> TicketState.USED.equals(t.getState()));
        if (allUsed) {
            return TicketState.USED;
        }

        boolean anyValid = tickets.stream().anyMatch(t -> TicketState.VALID.equals(t.getState()));
        if (anyValid) {
            return TicketState.VALID;
        }

        return TicketState.INVALID;
    }
}
