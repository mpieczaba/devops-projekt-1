import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Seat } from '../../../../shared/models/domain.models';

@Component({
  selector: 'app-seat',
  standalone: true,
  templateUrl: './seat.component.html',
  styleUrl: './seat.component.css',
})
export class SeatComponent {
  @Input({ required: true }) seat!: Seat;
  @Input() selected = false;
  @Output() toggled = new EventEmitter<number>();

  onClick(): void {
    if (!this.seat.reserved) {
      this.toggled.emit(this.seat.seatId);
    }
  }
}
