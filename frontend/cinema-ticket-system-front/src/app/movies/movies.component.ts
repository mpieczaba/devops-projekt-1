import { Component, EventEmitter, Output } from '@angular/core';
import { MovieComponent } from './movie/movie.component';
import { DUMMY_MOVIES } from './dummy-movies';
import { ShowsComponent } from './shows/shows.component';
import { Show } from './shows/show/show.model';

@Component({
  selector: 'app-movies',
  imports: [MovieComponent, ShowsComponent],
  templateUrl: './movies.component.html',
  styleUrl: './movies.component.css',
})
export class MoviesComponent {
  @Output() buyTicket = new EventEmitter<Show>();
  movies = DUMMY_MOVIES;

  onBuyTicket(show: Show) {
    this.buyTicket.emit(show);
  }
}
