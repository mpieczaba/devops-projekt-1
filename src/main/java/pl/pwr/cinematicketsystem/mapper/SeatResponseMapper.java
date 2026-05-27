package pl.pwr.cinematicketsystem.mapper;

import static java.util.Optional.ofNullable;

import org.springframework.stereotype.Component;
import pl.pwr.cinematicketsystem.dto.SeatResponse;
import pl.pwr.cinematicketsystem.entity.Room;
import pl.pwr.cinematicketsystem.entity.Seat;

@Component
public class SeatResponseMapper {

    public SeatResponse toReservedSeatResponse(Seat seat) {
        return SeatResponse.builder()
            .seatId(seat.getId())
            .rowNumber(seat.getRowNumber())
            .seatNumber(seat.getSeatNumber())
            .roomId(ofNullable(seat.getRoom()).map(Room::getId).orElse(null))
            .reserved(Boolean.TRUE)
            .build();
    }
}
