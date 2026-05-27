import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Seat } from './seat.model';

@Component({
  selector: 'app-seat',
  imports: [],
  templateUrl: './seat.component.html',
  styleUrl: './seat.component.css',
})
export class SeatComponent {
  @Input({ required: true }) seat!: Seat;
  @Input() selected = false;
  @Output() chosenSeat = new EventEmitter<number>();

  onClicked() {
    if (!this.seat.reserved) {
      this.chosenSeat.emit(this.seat.seatId);
    }
  }
}
