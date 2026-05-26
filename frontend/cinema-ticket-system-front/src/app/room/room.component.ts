import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { DUMMY_ROOMS } from './dummy-rooms';
import { SeatComponent } from './seat/seat.component';
import { Show } from '../movies/shows/show/show.model';

@Component({
  selector: 'app-room',
  imports: [SeatComponent],
  templateUrl: './room.component.html',
  styleUrl: './room.component.css',
})
export class RoomComponent implements OnChanges {
  @Input({ required: true }) show?: Show;
  @Output() seats = new EventEmitter<number[]>();
  dummyRooms = DUMMY_ROOMS;
  chosenSeats: number[] = [];

  ngOnChanges(changes: SimpleChanges) {
    if (changes['show']) {
      this.chosenSeats = [];
      this.seats.emit([])
    }
  }

  get selectedRoom() {
    const selectedSeats = this.dummyRooms.filter((seat) => seat.room_id === this.show?.room_id);

    const map = new Map<
      number,
      { id: number; row_number: number; seat_number: number; room_id: number; reserved: boolean; }[]
    >();

    for (const seat of selectedSeats) {
      if (!map.has(seat.row_number)) {
        map.set(seat.row_number, []);
      }
      map.get(seat.row_number)!.push(seat);
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
