package pl.pwr.cinematicketsystem.dto;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class SeatResponse {
    private Integer seatId;
    private Integer rowNumber;
    private Integer seatNumber;
    private Integer roomId;
    private Boolean reserved;
}
