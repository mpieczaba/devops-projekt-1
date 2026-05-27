import { ChangeDetectorRef, Component, DestroyRef, EventEmitter, inject, OnInit, Output, signal } from '@angular/core';
import { MovieComponent } from './movie/movie.component';
// import { DUMMY_MOVIES } from './dummy-movies';
import { ShowsComponent } from './shows/shows.component';
import { Show } from './shows/show/show.model';
import { HttpClient } from '@angular/common/http';
import { Movie } from './movie/movie.model';

@Component({
  selector: 'app-movies',
  imports: [MovieComponent, ShowsComponent],
  templateUrl: './movies.component.html',
  styleUrl: './movies.component.css',
})
export class MoviesComponent implements OnInit {
  @Output() buyTicket = new EventEmitter<Show>();
  private httpClient = inject(HttpClient);
  private destroyRef = inject(DestroyRef);
  movies = signal<Movie[] | undefined>(undefined);

  ngOnInit() {
    const subscription = this.httpClient
      .get<Movie[]>('http://localhost:8080/movies')
      .subscribe({
        next: (resData) => {
          this.movies.set(resData);
        }
      })

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    })
  }

  onBuyTicket(show: Show) {
    this.buyTicket.emit(show);
  }
}
