import { DatePipe } from '@angular/common';
import { Component, HostListener, inject } from '@angular/core';
import { ModalShellComponent } from '../../../../shared/ui/modal/modal-shell.component';
import { BookingFacade } from '../../services/booking.facade';
import { SeatMapComponent } from '../seat-map/seat-map.component';

@Component({
  selector: 'app-seat-picker-dialog',
  standalone: true,
  imports: [DatePipe, ModalShellComponent, SeatMapComponent],
  templateUrl: './seat-picker-dialog.component.html',
  styleUrl: './seat-picker-dialog.component.css',
})
export class SeatPickerDialogComponent {
  protected readonly booking = inject(BookingFacade);

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.booking.closeSeatPicker();
  }
}
