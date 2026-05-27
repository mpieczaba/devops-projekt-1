import { Component, HostListener, inject } from '@angular/core';
import { ModalShellComponent } from '../../../../shared/ui/modal/modal-shell.component';
import { BookingFacade } from '../../services/booking.facade';

@Component({
  selector: 'app-reservation-success-dialog',
  standalone: true,
  imports: [ModalShellComponent],
  templateUrl: './reservation-success-dialog.component.html',
  styleUrl: './reservation-success-dialog.component.css',
})
export class ReservationSuccessDialogComponent {
  protected readonly booking = inject(BookingFacade);

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.booking.dismissSuccess();
  }
}
