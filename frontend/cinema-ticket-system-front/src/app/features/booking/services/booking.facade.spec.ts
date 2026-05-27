import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { Seat, Show } from '../../../shared/models/domain.models';
import { BodyScrollLockService } from '../../../shared/services/body-scroll-lock.service';
import { ReservationRepository } from '../data/reservation.repository';
import { SeatRepository } from '../data/seat.repository';
import { BookingFacade } from './booking.facade';

const show: Show = { id: 5, date: '2026-05-27T18:00:00', movieId: 1, roomId: 1 };
const seats: Seat[] = [
  { seatId: 1, rowNumber: 1, seatNumber: 1, roomId: 1, reserved: false },
  { seatId: 2, rowNumber: 1, seatNumber: 2, roomId: 1, reserved: false },
];

class SeatRepositoryStub extends SeatRepository {
  findByShowId = vi.fn(() => of(seats));
}

class ReservationRepositoryStub extends ReservationRepository {
  create = vi.fn(() => of({ id: 1, code: 'RES-TEST01' }));
}

describe('BookingFacade', () => {
  let facade: BookingFacade;
  let reservations: ReservationRepositoryStub;
  let scrollLock: BodyScrollLockService;

  beforeEach(() => {
    reservations = new ReservationRepositoryStub();

    TestBed.configureTestingModule({
      providers: [
        BookingFacade,
        BodyScrollLockService,
        { provide: SeatRepository, useClass: SeatRepositoryStub },
        { provide: ReservationRepository, useValue: reservations },
      ],
    });

    facade = TestBed.inject(BookingFacade);
    scrollLock = TestBed.inject(BodyScrollLockService);
    scrollLock.reset();
  });

  it('opens seat picker and loads seats', () => {
    facade.openSeatPicker(show);

    expect(facade.isSeatPickerOpen()).toBe(true);
    expect(facade.selectedShow()).toEqual(show);
    expect(facade.seats()).toEqual(seats);
  });

  it('toggles selected seats', () => {
    facade.openSeatPicker(show);
    facade.toggleSeat(1);
    facade.toggleSeat(2);

    expect(facade.chosenSeatIds()).toEqual([1, 2]);

    facade.toggleSeat(1);
    expect(facade.chosenSeatIds()).toEqual([2]);
  });

  it('creates reservation and shows success code', () => {
    facade.openSeatPicker(show);
    facade.toggleSeat(1);
    facade.confirmReservation();

    expect(reservations.create).toHaveBeenCalledWith({ showId: 5, seatIds: [1] });
    expect(facade.isSeatPickerOpen()).toBe(false);
    expect(facade.reservationCode()).toBe('RES-TEST01');
    expect(facade.isSuccessOpen()).toBe(true);
  });

  it('does not confirm without selected seats', () => {
    facade.openSeatPicker(show);
    facade.confirmReservation();

    expect(reservations.create).not.toHaveBeenCalled();
  });

  it('sets error when reservation fails', () => {
    reservations.create.mockReturnValue(throwError(() => new Error('conflict')));
    facade.openSeatPicker(show);
    facade.toggleSeat(2);
    facade.confirmReservation();

    expect(facade.error()).toBe('Rezerwacja nie powiodła się. Spróbuj ponownie.');
    expect(facade.confirming()).toBe(false);
  });
});
