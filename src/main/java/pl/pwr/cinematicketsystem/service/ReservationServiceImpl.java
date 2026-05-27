package pl.pwr.cinematicketsystem.service;

import static java.util.Optional.ofNullable;

import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.pwr.cinematicketsystem.dto.ReservationRequest;
import pl.pwr.cinematicketsystem.dto.ReservationResponse;
import pl.pwr.cinematicketsystem.entity.Reservation;
import pl.pwr.cinematicketsystem.entity.Show;
import pl.pwr.cinematicketsystem.entity.Ticket;
import pl.pwr.cinematicketsystem.entity.TicketState;
import pl.pwr.cinematicketsystem.exception.ResourceNotFoundException;
import pl.pwr.cinematicketsystem.repository.ReservationRepository;

@Service
@RequiredArgsConstructor
public class ReservationServiceImpl implements ReservationService {

    private final ReservationRepository reservationRepository;
    private final SeatService seatService;
    private final ShowService showService;

    @Override
    public Reservation getReservationById(Integer id) {
        return reservationRepository
            .findById(id)
            .orElseThrow(() ->
                new ResourceNotFoundException(
                    "Reservation not found with id: " + id
                )
            );
    }

    @Override
    public Reservation getReservationByCode(String code) {
        return ofNullable(reservationRepository.findByCode(code)).orElseThrow(() ->
            new ResourceNotFoundException("Reservation not found with code: " + code)
        );
    }

    @Transactional
    @Override
    public ReservationResponse addReservation(
        ReservationRequest reservationRequest
    ) {
        Reservation reservation = new Reservation();
        String code = "RES-" + UUID.randomUUID().toString().substring(0, 8);
        reservation.setCode(code);

        Show show = showService.getShowById(reservationRequest.getShowId());

        for (Integer id : reservationRequest.getSeatIds()) {
            Ticket ticket = Ticket.builder()
                .seat(seatService.getSeatById(id))
                .show(show)
                .reservation(reservation)
                .state(TicketState.INVALID)
                .code("TCK-" + UUID.randomUUID().toString().substring(0, 8))
                .build();

            reservation.addTicket(ticket);
        }

        try {
            Reservation newReservation = reservationRepository.save(
                reservation
            );
            return mapToResponse(newReservation);
        } catch (org.springframework.dao.DataIntegrityViolationException e) {
            throw e; // GlobalExceptionHandler will map to 409
        }
    }

    public ReservationResponse mapToResponse(Reservation reservation) {
        return ReservationResponse.builder()
            .id(reservation.getId())
            .code(reservation.getCode())
            .build();
    }
}
