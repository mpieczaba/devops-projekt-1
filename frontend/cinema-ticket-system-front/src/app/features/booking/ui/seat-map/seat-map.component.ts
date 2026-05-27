import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Seat, Show } from '../../../../shared/models/domain.models';
import { groupSeatsByRow, SeatRow } from '../../../../shared/utils/seat-layout.util';
import { SeatComponent } from '../seat/seat.component';

@Component({
  selector: 'app-seat-map',
  standalone: true,
  imports: [SeatComponent],
  templateUrl: './seat-map.component.html',
  styleUrl: './seat-map.component.css',
})
export class SeatMapComponent {
  @Input({ required: true }) show!: Show;
  @Input() seats: Seat[] | undefined;
  @Input() chosenSeatIds: number[] = [];
  @Input() loading = false;
  @Output() seatToggled = new EventEmitter<number>();

  get rows(): SeatRow[] {
    if (!this.seats) {
      return [];
    }
    return groupSeatsByRow(this.seats, this.show.roomId);
  }
}
