package pl.pwr.cinematicketsystem.dto;

import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class ShowResponse {
    private Integer id;
    private LocalDateTime date;
    private Integer movieId;
    private Integer roomId;
}
