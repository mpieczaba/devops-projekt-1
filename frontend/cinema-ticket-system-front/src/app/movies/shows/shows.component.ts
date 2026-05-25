import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ShowComponent } from './show/show.component';
import { DUMMY_SHOWS } from './dummy-shows';
import { Show } from './show/show.model';

@Component({
  selector: 'app-shows',
  imports: [ShowComponent],
  templateUrl: './shows.component.html',
  styleUrl: './shows.component.css',
})
export class ShowsComponent {
  @Input({ required: true }) movieId!: number;
  @Output() buyTicket = new EventEmitter<Show>();
  shows = DUMMY_SHOWS;

  get selectedShows() {
    return this.shows.filter((show) => show.movie_id === this.movieId);
  }

  onBuyTicket(show: Show){
    this.buyTicket.emit(show);
  }
}
