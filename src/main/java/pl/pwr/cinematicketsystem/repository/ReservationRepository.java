package pl.pwr.cinematicketsystem.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.pwr.cinematicketsystem.entity.Reservation;

public interface ReservationRepository
    extends JpaRepository<Reservation, Integer> {
    Reservation findByCode(String code);
}
