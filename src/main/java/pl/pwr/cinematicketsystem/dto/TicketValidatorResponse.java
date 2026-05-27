package pl.pwr.cinematicketsystem.dto;

import java.time.LocalDateTime;
import java.util.List;
import lombok.Builder;
import lombok.Getter;
import pl.pwr.cinematicketsystem.entity.TicketState;

@Builder
@Getter
public class TicketValidatorResponse {

    private String reservationCode;
    private String ticketCode;
    private TicketState ticketState;
    private Integer numberOfReservedSeats;
    private LocalDateTime showDate;
    private List<SeatResponse> seats;
    private Integer roomId;
    private List<SeatResponse> reservedSeats;
}
