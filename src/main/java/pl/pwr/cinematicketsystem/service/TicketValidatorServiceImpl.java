package pl.pwr.cinematicketsystem.service;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.pwr.cinematicketsystem.dto.TicketValidatorResponse;
import pl.pwr.cinematicketsystem.entity.Reservation;
import pl.pwr.cinematicketsystem.entity.Ticket;
import pl.pwr.cinematicketsystem.entity.TicketState;
import pl.pwr.cinematicketsystem.exception.ResourceNotFoundException;
import pl.pwr.cinematicketsystem.mapper.TicketValidatorResponseMapper;
import pl.pwr.cinematicketsystem.repository.TicketRepository;

@Service
@RequiredArgsConstructor
public class TicketValidatorServiceImpl implements TicketValidatorService {

    private final TicketRepository ticketRepository;
    private final TicketService ticketService;
    private final ShowService showService;
    private final ReservationService reservationService;
    private final TicketValidatorResponseMapper responseMapper;

    @Override
    @Transactional
    public void scanTicket(String code) {
        Reservation reservation = reservationService.getReservationByCode(code);
        List<Ticket> tickets = reservation.getTickets();

        tickets.forEach(ticketService::updateState);

        boolean hasValidTicket = tickets
            .stream()
            .anyMatch(ticket -> TicketState.VALID.equals(ticket.getState()));

        if (hasValidTicket) {
            tickets
                .stream()
                .filter(ticket -> TicketState.VALID.equals(ticket.getState()))
                .forEach(ticket -> {
                    ticket.setState(TicketState.USED);
                    ticketRepository.save(ticket);
                });
        }
    }

    @Override
    public TicketValidatorResponse getInfo(String code) {
        Reservation reservation = reservationService.getReservationByCode(code);
        List<Ticket> tickets = reservation.getTickets();

        if (tickets.isEmpty()) {
            throw new ResourceNotFoundException(
                "No tickets found for reservation code: " + code
            );
        }

        tickets.forEach(ticketService::updateState);

        Ticket referenceTicket = tickets.getFirst();
        return responseMapper.toResponse(
            reservation,
            showService.getSeats(referenceTicket.getShow().getId())
        );
    }
}
