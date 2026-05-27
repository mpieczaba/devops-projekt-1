import {
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  signal,
  SimpleChanges,
} from '@angular/core';
// import { DUMMY_ROOMS } from './dummy-rooms';
import { SeatComponent } from './seat/seat.component';
import { Show } from '../movies/shows/show/show.model';
import { HttpClient } from '@angular/common/http';
import { Seat } from './seat/seat.model';

@Component({
  selector: 'app-room',
  imports: [SeatComponent],
  templateUrl: './room.component.html',
  styleUrl: './room.component.css',
})
export class RoomComponent implements OnChanges {
  @Input({ required: true }) show?: Show;
  @Output() seats = new EventEmitter<number[]>();
  private httpClient = inject(HttpClient);
  private destroyRef = inject(DestroyRef);

  room = signal<Seat[] | undefined>(undefined);
  chosenSeats: number[] = [];

  ngOnChanges(changes: SimpleChanges) {
    if (changes['show']) {
      if (this.show) {
        const subscribtion = this.httpClient
          .get<Seat[]>('http://localhost:8080/shows/' + this.show?.id + '/seats')
          .subscribe({
            next: (redData) => {
              this.room.set(redData);
            },
          });
      }
      this.chosenSeats = [];
      this.seats.emit([]);
    }
  }

  get selectedRoom() {
    const selectedSeats = this.room()?.filter((seat) => seat.roomId === this.show?.roomId) ?? [];

    const map = new Map<number, Seat[]>();

    for (const seat of selectedSeats) {
      if (!map.has(seat.rowNumber)) {
        map.set(seat.rowNumber, []);
      }
      map.get(seat.rowNumber)!.push(seat);
    }

    return Array.from(map.entries()).sort((a, b) => a[0] - b[0]);
  }

  onChosenSeat(seatId: number) {
    if (this.chosenSeats.includes(seatId)) {
      this.chosenSeats = this.chosenSeats.filter((id) => id !== seatId);
    } else {
      this.chosenSeats.push(seatId);
    }

    return this.seats.emit(this.chosenSeats);
  }
}
