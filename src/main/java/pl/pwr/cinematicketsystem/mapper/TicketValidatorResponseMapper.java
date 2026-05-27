package pl.pwr.cinematicketsystem.mapper;

import static java.util.Optional.ofNullable;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import pl.pwr.cinematicketsystem.dto.SeatResponse;
import pl.pwr.cinematicketsystem.dto.TicketValidatorResponse;
import pl.pwr.cinematicketsystem.domain.ticket.ReservationTicketStateResolver;
import pl.pwr.cinematicketsystem.entity.Reservation;
import pl.pwr.cinematicketsystem.entity.Room;
import pl.pwr.cinematicketsystem.entity.Seat;
import pl.pwr.cinematicketsystem.entity.Show;
import pl.pwr.cinematicketsystem.entity.Ticket;

@Component
@RequiredArgsConstructor
public class TicketValidatorResponseMapper {

    private final SeatResponseMapper seatResponseMapper;
    private final ReservationTicketStateResolver stateResolver;

    public TicketValidatorResponse toResponse(
        Reservation reservation,
        List<SeatResponse> hallSeats
    ) {
        List<Ticket> tickets = reservation.getTickets();
        Ticket referenceTicket = tickets.getFirst();

        List<SeatResponse> reservedSeats = tickets
            .stream()
            .map(Ticket::getSeat)
            .filter(seat -> seat != null)
            .map(seatResponseMapper::toReservedSeatResponse)
            .toList();

        Integer roomId = ofNullable(referenceTicket)
            .map(Ticket::getShow)
            .map(Show::getRoom)
            .map(Room::getId)
            .orElse(null);

        return TicketValidatorResponse.builder()
            .reservationCode(reservation.getCode())
            .ticketCode(reservation.getCode())
            .ticketState(stateResolver.resolve(tickets))
            .numberOfReservedSeats(tickets.size())
            .showDate(referenceTicket.getShow().getDate())
            .seats(hallSeats)
            .roomId(roomId)
            .reservedSeats(reservedSeats)
            .build();
    }
}
