package pl.pwr.cinematicketsystem.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.time.Clock;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import pl.pwr.cinematicketsystem.domain.ticket.TicketValidityPolicy;
import pl.pwr.cinematicketsystem.entity.Movie;
import pl.pwr.cinematicketsystem.entity.Show;
import pl.pwr.cinematicketsystem.entity.Ticket;
import pl.pwr.cinematicketsystem.entity.TicketState;
import pl.pwr.cinematicketsystem.repository.TicketRepository;

@ExtendWith(MockitoExtension.class)
class TicketServiceImplTest {

    @Mock
    TicketRepository ticketRepository;

    // other dependencies not used by updateState can be mocked
    @Mock
    ShowService showService;
    @Mock
    SeatService seatService;
    @Mock
    ReservationService reservationService;

    TicketValidityPolicy ticketValidityPolicy = new TicketValidityPolicy();

    Clock clock;

    TicketServiceImpl ticketService;

    @BeforeEach
    void setup() {
        clock = Clock.fixed(Instant.parse("2026-01-01T12:00:00Z"), ZoneId.of("UTC"));
        ticketService = new TicketServiceImpl(
            ticketRepository,
            showService,
            seatService,
            reservationService,
            ticketValidityPolicy,
            clock
        );
    }

    @Test
    void updateState_setsValid_whenWithinWindow() {
        // show time 2026-01-01T13:00Z, duration 120 minutes
        LocalDateTime showTime = LocalDateTime.of(2026, 1, 1, 13, 0);
        Movie movie = Movie.builder().durationMinutes(120).build();
        Show show = new Show();
        show.setDate(showTime);
        show.setMovie(movie);

        Ticket ticket = Ticket.builder().id(1).state(null).show(show).build();

        // set clock to 12:50 UTC => within 15 minutes before show start
        clock = Clock.fixed(Instant.parse("2026-01-01T12:50:00Z"), ZoneId.of("UTC"));
        ticketService = new TicketServiceImpl(
            ticketRepository,
            showService,
            seatService,
            reservationService,
            ticketValidityPolicy,
            clock
        );

        when(ticketRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        ticketService.updateState(ticket);

        assertEquals(TicketState.VALID, ticket.getState());
        verify(ticketRepository, times(1)).save(ticket);
    }

    @Test
    void updateState_setsInvalid_beforeWindow() {
        LocalDateTime showTime = LocalDateTime.of(2026, 1, 1, 13, 0);
        Movie movie = Movie.builder().durationMinutes(100).build();
        Show show = new Show();
        show.setDate(showTime);
        show.setMovie(movie);

        Ticket ticket = Ticket.builder().id(2).state(null).show(show).build();

        // set clock to 12:44 UTC => more than 15 minutes before (16 minutes before)
        clock = Clock.fixed(Instant.parse("2026-01-01T12:44:00Z"), ZoneId.of("UTC"));
        ticketService = new TicketServiceImpl(
            ticketRepository,
            showService,
            seatService,
            reservationService,
            ticketValidityPolicy,
            clock
        );

        when(ticketRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        ticketService.updateState(ticket);

        assertEquals(TicketState.INVALID, ticket.getState());
        verify(ticketRepository, times(1)).save(ticket);
    }

    @Test
    void updateState_setsInvalid_afterEnd() {
        LocalDateTime showTime = LocalDateTime.of(2026, 1, 1, 10, 0);
        Movie movie = Movie.builder().durationMinutes(90).build(); // ends 11:30
        Show show = new Show();
        show.setDate(showTime);
        show.setMovie(movie);

        Ticket ticket = Ticket.builder().id(3).state(null).show(show).build();

        // set clock to 12:00 UTC => after end
        clock = Clock.fixed(Instant.parse("2026-01-01T12:00:00Z"), ZoneId.of("UTC"));
        ticketService = new TicketServiceImpl(
            ticketRepository,
            showService,
            seatService,
            reservationService,
            ticketValidityPolicy,
            clock
        );

        when(ticketRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        ticketService.updateState(ticket);

        assertEquals(TicketState.INVALID, ticket.getState());
        verify(ticketRepository, times(1)).save(ticket);
    }

    @Test
    void updateState_keepsUsed_whenUsed() {
        LocalDateTime showTime = LocalDateTime.of(2026, 1, 1, 13, 0);
        Movie movie = Movie.builder().durationMinutes(120).build();
        Show show = new Show();
        show.setDate(showTime);
        show.setMovie(movie);

        Ticket ticket = Ticket.builder().id(4).state(TicketState.USED).show(show).build();

        // set clock to within window
        clock = Clock.fixed(Instant.parse("2026-01-01T12:50:00Z"), ZoneId.of("UTC"));
        ticketService = new TicketServiceImpl(
            ticketRepository,
            showService,
            seatService,
            reservationService,
            ticketValidityPolicy,
            clock
        );

        ticketService.updateState(ticket);

        assertEquals(TicketState.USED, ticket.getState());
        verify(ticketRepository, never()).save(any());
    }
}
