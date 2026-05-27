package pl.pwr.cinematicketsystem.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.time.LocalDateTime;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import pl.pwr.cinematicketsystem.dto.SeatResponse;
import pl.pwr.cinematicketsystem.dto.ShowResponse;
import pl.pwr.cinematicketsystem.entity.Movie;
import pl.pwr.cinematicketsystem.entity.Room;
import pl.pwr.cinematicketsystem.entity.Seat;
import pl.pwr.cinematicketsystem.entity.Show;
import pl.pwr.cinematicketsystem.entity.Ticket;
import pl.pwr.cinematicketsystem.repository.ShowRepository;
import pl.pwr.cinematicketsystem.repository.TicketRepository;

@ExtendWith(MockitoExtension.class)
class ShowServiceImplTest {

    @Mock
    ShowRepository showRepository;
    @Mock
    MovieService movieService;
    @Mock
    RoomService roomService;
    @Mock
    TicketRepository ticketRepository;

    @Test
    void mapToResponse_includesMovieData() {
        Movie m = Movie.builder().id(7).durationMinutes(120).title("A").description("D").imageUrl("u").build();
        Room room = new Room();
        room.setId(2);
        Show s = new Show();
        s.setId(5);
        s.setMovie(m);
        s.setRoom(room);
        s.setDate(LocalDateTime.now());
        ShowServiceImpl svc = new ShowServiceImpl(showRepository, movieService, roomService, ticketRepository);
        ShowResponse resp = svc.mapToResponse(s);
        assertEquals(5, resp.getId());
        assertEquals(2, resp.getRoomId());
        assertEquals(7, resp.getMovieId());
    }

    @Test
    void getSeats_marksReserved() {
        Room room = new Room(); room.setId(1);
        Seat seat1 = new Seat(11, 1, 1, room, null);
        Seat seat2 = new Seat(12, 1, 2, room, null);
        room.setSeats(List.of(seat1, seat2));

        Show show = new Show(); show.setId(3); show.setRoom(room);

        Ticket t = Ticket.builder().seat(seat1).show(show).build();

        when(showRepository.findById(3)).thenReturn(java.util.Optional.of(show));
        when(ticketRepository.findByShowId(3)).thenReturn(List.of(t));

        ShowServiceImpl svc = new ShowServiceImpl(showRepository, movieService, roomService, ticketRepository);
        List<SeatResponse> seats = svc.getSeats(3);

        assertEquals(2, seats.size());
        SeatResponse r1 = seats.stream().filter(s -> s.getSeatNumber()==1).findFirst().orElse(null);
        assertNotNull(r1);
        assertTrue(Boolean.TRUE.equals(r1.getReserved()));
        SeatResponse r2 = seats.stream().filter(s -> s.getSeatNumber()==2).findFirst().orElse(null);
        assertNotNull(r2);
        assertFalse(Boolean.TRUE.equals(r2.getReserved()));
    }
}
