package pl.pwr.cinematicketsystem.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import pl.pwr.cinematicketsystem.dto.SeatResponse;
import pl.pwr.cinematicketsystem.dto.TicketValidatorResponse;
import pl.pwr.cinematicketsystem.entity.Reservation;
import pl.pwr.cinematicketsystem.entity.Room;
import pl.pwr.cinematicketsystem.entity.Seat;
import pl.pwr.cinematicketsystem.entity.Show;
import pl.pwr.cinematicketsystem.entity.Ticket;
import pl.pwr.cinematicketsystem.entity.TicketState;
import pl.pwr.cinematicketsystem.mapper.TicketValidatorResponseMapper;
import pl.pwr.cinematicketsystem.repository.TicketRepository;

@ExtendWith(MockitoExtension.class)
class TicketValidatorServiceImplTest {

    @Mock
    TicketRepository ticketRepository;
    @Mock
    TicketService ticketService;
    @Mock
    ShowService showService;
    @Mock
    ReservationService reservationService;
    @Mock
    TicketValidatorResponseMapper responseMapper;

    @Test
    void scanTicket_setsUsed_whenValid() {
        Ticket t = new Ticket();
        t.setCode("TCK-1");
        t.setState(TicketState.VALID);
        Reservation reservation = new Reservation();
        reservation.setCode("RES-ABC");
        reservation.setTickets(new ArrayList<>(List.of(t)));
        t.setReservation(reservation);

        when(reservationService.getReservationByCode("RES-ABC")).thenReturn(reservation);
        doAnswer(inv -> {
            Ticket ticket = inv.getArgument(0);
            ticket.setState(TicketState.VALID);
            return null;
        }).when(ticketService).updateState(any());
        when(ticketRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        TicketValidatorServiceImpl svc = new TicketValidatorServiceImpl(
            ticketRepository,
            ticketService,
            showService,
            reservationService,
            responseMapper
        );
        svc.scanTicket("RES-ABC");

        assertEquals(TicketState.USED, t.getState());
        verify(ticketRepository, times(1)).save(t);
    }

    @Test
    void getInfo_delegatesToMapper() {
        Room room = new Room();
        room.setId(9);
        Seat seat = new Seat(21, 1, 1, room, null);
        room.setSeats(List.of(seat));

        Show show = new Show();
        show.setId(4);
        show.setDate(LocalDateTime.now());
        show.setRoom(room);

        Ticket ticket = new Ticket();
        ticket.setCode("TCK-Z");
        ticket.setShow(show);
        ticket.setSeat(seat);
        Reservation res = new Reservation();
        res.setCode("RES-Z");
        res.setTickets(new ArrayList<>(List.of(ticket)));
        ticket.setReservation(res);

        TicketValidatorResponse expected = TicketValidatorResponse.builder()
            .reservationCode("RES-Z")
            .ticketState(TicketState.VALID)
            .numberOfReservedSeats(1)
            .roomId(9)
            .build();

        when(reservationService.getReservationByCode("RES-Z")).thenReturn(res);
        doAnswer(inv -> {
            Ticket t = inv.getArgument(0);
            t.setState(TicketState.VALID);
            return null;
        }).when(ticketService).updateState(ticket);
        when(showService.getSeats(4)).thenReturn(List.of());
        when(responseMapper.toResponse(res, List.of())).thenReturn(expected);

        TicketValidatorServiceImpl svc = new TicketValidatorServiceImpl(
            ticketRepository,
            ticketService,
            showService,
            reservationService,
            responseMapper
        );
        TicketValidatorResponse r = svc.getInfo("RES-Z");

        assertEquals(expected, r);
        verify(responseMapper).toResponse(res, List.of());
    }
}
