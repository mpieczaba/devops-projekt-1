import { Injectable, computed, inject, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { Show } from '../../../shared/models/domain.models';
import { BodyScrollLockService } from '../../../shared/services/body-scroll-lock.service';
import { ReservationRepository } from '../data/reservation.repository';
import { SeatRepository } from '../data/seat.repository';
import { Seat } from '../../../shared/models/domain.models';
import { toggleSeatSelection } from '../../../shared/utils/seat-layout.util';

@Injectable()
export class BookingFacade {
  private readonly reservationRepository = inject(ReservationRepository);
  private readonly seatRepository = inject(SeatRepository);
  private readonly scrollLock = inject(BodyScrollLockService);

  private readonly selectedShowState = signal<Show | null>(null);
  private readonly seatsState = signal<Seat[] | undefined>(undefined);
  private readonly chosenSeatIdsState = signal<number[]>([]);
  private readonly reservationCodeState = signal<string | null>(null);
  private readonly confirmingState = signal(false);
  private readonly errorState = signal<string | null>(null);

  readonly selectedShow = this.selectedShowState.asReadonly();
  readonly seats = this.seatsState.asReadonly();
  readonly chosenSeatIds = this.chosenSeatIdsState.asReadonly();
  readonly reservationCode = this.reservationCodeState.asReadonly();
  readonly confirming = this.confirmingState.asReadonly();
  readonly error = this.errorState.asReadonly();

  readonly isSeatPickerOpen = computed(() => this.selectedShowState() !== null);
  readonly isSuccessOpen = computed(() => this.reservationCodeState() !== null);

  openSeatPicker(show: Show): void {
    this.selectedShowState.set(show);
    this.chosenSeatIdsState.set([]);
    this.seatsState.set(undefined);
    this.errorState.set(null);
    this.syncScrollLock();

    this.seatRepository.findByShowId(show.id).subscribe({
      next: (seats) => this.seatsState.set(seats),
      error: () => this.errorState.set('Nie udało się pobrać planu sali.'),
    });
  }

  closeSeatPicker(): void {
    this.selectedShowState.set(null);
    this.chosenSeatIdsState.set([]);
    this.seatsState.set(undefined);
    this.confirmingState.set(false);
    this.errorState.set(null);
    this.syncScrollLock();
  }

  toggleSeat(seatId: number): void {
    this.chosenSeatIdsState.update((ids) => toggleSeatSelection(ids, seatId));
  }

  confirmReservation(): void {
    const show = this.selectedShowState();
    const seatIds = this.chosenSeatIdsState();

    if (!show || seatIds.length === 0 || this.confirmingState()) {
      return;
    }

    this.confirmingState.set(true);
    this.errorState.set(null);

    this.reservationRepository
      .create({ showId: show.id, seatIds })
      .pipe(finalize(() => this.confirmingState.set(false)))
      .subscribe({
        next: (result) => {
          this.selectedShowState.set(null);
          this.chosenSeatIdsState.set([]);
          this.seatsState.set(undefined);
          this.reservationCodeState.set(result.code);
          this.syncScrollLock();
        },
        error: () => this.errorState.set('Rezerwacja nie powiodła się. Spróbuj ponownie.'),
      });
  }

  dismissSuccess(): void {
    this.reservationCodeState.set(null);
    this.syncScrollLock();
  }

  private syncScrollLock(): void {
    this.scrollLock.reset();
    if (this.isSeatPickerOpen() || this.isSuccessOpen()) {
      this.scrollLock.lock();
    }
  }
}
