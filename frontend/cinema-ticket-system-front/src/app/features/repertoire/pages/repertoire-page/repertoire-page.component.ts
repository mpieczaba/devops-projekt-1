import { Component, inject, OnInit } from '@angular/core';
import { Movie, Show } from '../../../../shared/models/domain.models';
import { BookingFacade } from '../../../booking/services/booking.facade';
import { RepertoireFacade } from '../../services/repertoire.facade';
import { MovieCardComponent } from '../../ui/movie-card/movie-card.component';
import { ShowListComponent } from '../../ui/show-list/show-list.component';
import { SeatPickerDialogComponent } from '../../../booking/ui/seat-picker-dialog/seat-picker-dialog.component';
import { ReservationSuccessDialogComponent } from '../../../booking/ui/reservation-success-dialog/reservation-success-dialog.component';

@Component({
  selector: 'app-repertoire-page',
  standalone: true,
  imports: [
    MovieCardComponent,
    ShowListComponent,
    SeatPickerDialogComponent,
    ReservationSuccessDialogComponent,
  ],
  templateUrl: './repertoire-page.component.html',
  styleUrl: './repertoire-page.component.css',
  providers: [RepertoireFacade, BookingFacade],
})
export class RepertoirePageComponent implements OnInit {
  protected readonly repertoire = inject(RepertoireFacade);
  protected readonly booking = inject(BookingFacade);

  ngOnInit(): void {
    this.repertoire.load();
  }

  showsFor(movie: Movie): Show[] {
    return this.repertoire.showsForMovie(movie.id);
  }

  onShowSelected(show: Show): void {
    this.booking.openSeatPicker(show);
  }
}
