import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-seat',
  imports: [],
  templateUrl: './seat.component.html',
  styleUrl: './seat.component.css',
})
export class SeatComponent {
  @Input({ required: true }) seat!: {
    id: number;
    row_number: number;
    seat_number: number;
    room_id: number;
    reserved: boolean;
  };
  @Output() chosenSeat = new EventEmitter<number>();

  selected = false;

  onClicked() {
    this.selected = !this.selected;
    this.chosenSeat.emit(this.seat.id);
  }
}
