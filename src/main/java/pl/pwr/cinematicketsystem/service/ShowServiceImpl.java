package pl.pwr.cinematicketsystem.service;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pl.pwr.cinematicketsystem.dto.SeatResponse;
import pl.pwr.cinematicketsystem.dto.ShowRequest;
import pl.pwr.cinematicketsystem.dto.ShowResponse;
import pl.pwr.cinematicketsystem.entity.Room;
import pl.pwr.cinematicketsystem.entity.Seat;
import pl.pwr.cinematicketsystem.entity.Show;
import pl.pwr.cinematicketsystem.entity.Ticket;
import pl.pwr.cinematicketsystem.exception.ResourceNotFoundException;
import pl.pwr.cinematicketsystem.repository.ShowRepository;
import pl.pwr.cinematicketsystem.repository.TicketRepository;

@Service
@RequiredArgsConstructor
public class ShowServiceImpl implements ShowService {

    private final ShowRepository showRepository;
    private final MovieService movieService;
    private final RoomService roomService;
    private final TicketRepository ticketRepository;

    @Override
    public Show getShowById(Integer id) {
        return showRepository
            .findById(id)
            .orElseThrow(() ->
                new ResourceNotFoundException("Show not found with id: " + id)
            );
    }

    @Override
    public ShowResponse addShow(ShowRequest showRequest) {
        Show show = new Show();

        show.setDate(showRequest.getDate());
        show.setRoom(roomService.getRoomById(showRequest.getRoomId()));
        show.setMovie(movieService.getMovieById(showRequest.getMovieId()));
        Show newShow = showRepository.save(show);
        return mapToResponse(newShow);
    }

    @Override
    public List<ShowResponse> getAllShows() {
        return showRepository
            .findAll()
            .stream()
            .map(this::mapToResponse)
            .toList();
    }

    @Override
    public ShowResponse mapToResponse(Show show) {
        return ShowResponse.builder()
                .id(show.getId())
                .roomId(show.getRoom().getId())
                .movieId(show.getMovie().getId())
                .date(show.getDate())
            .build();
    }

    @Override
    public List<SeatResponse> getSeats(Integer id) {
        Show show = getShowById(id);

        Room room = show.getRoom();

        List<Ticket> tickets = ticketRepository.findByShowId(id);
        List<Seat> reservedSeats = tickets
            .stream()
            .map(Ticket::getSeat)
            .toList();
        return room
            .getSeats()
            .stream()
            .map(seat ->
                SeatResponse.builder()
                        .seatId(seat.getId())
                    .rowNumber(seat.getRowNumber())
                    .seatNumber(seat.getSeatNumber())
                    .roomId(seat.getRoom().getId())
                    .reserved(reservedSeats.contains(seat))
                    .build()
            )
            .toList();
    }
}
