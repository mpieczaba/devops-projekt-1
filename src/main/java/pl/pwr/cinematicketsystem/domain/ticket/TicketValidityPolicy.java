package pl.pwr.cinematicketsystem.domain.ticket;

import java.time.LocalDateTime;
import org.springframework.stereotype.Component;
import pl.pwr.cinematicketsystem.entity.Movie;
import pl.pwr.cinematicketsystem.entity.Show;
import pl.pwr.cinematicketsystem.entity.Ticket;
import pl.pwr.cinematicketsystem.entity.TicketState;

/**
 * Encapsulates the business rule: a ticket is valid from 15 minutes before
 * the show starts until the show ends.
 */
@Component
public class TicketValidityPolicy {

    private static final int MINUTES_BEFORE_SHOW = 15;

    public TicketState resolveState(Ticket ticket, LocalDateTime now) {
        if (TicketState.USED.equals(ticket.getState())) {
            return TicketState.USED;
        }

        Show show = ticket.getShow();
        Movie movie = show.getMovie();
        LocalDateTime showStart = show.getDate();
        int durationMinutes = movie.getDurationMinutes() != null ? movie.getDurationMinutes() : 0;
        LocalDateTime showEnd = showStart.plusMinutes(durationMinutes);
        LocalDateTime validFrom = showStart.minusMinutes(MINUTES_BEFORE_SHOW);

        boolean withinWindow = !now.isBefore(validFrom) && !now.isAfter(showEnd);
        return withinWindow ? TicketState.VALID : TicketState.INVALID;
    }
}
