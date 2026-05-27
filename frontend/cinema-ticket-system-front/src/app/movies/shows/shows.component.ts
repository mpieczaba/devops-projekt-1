import { Component, DestroyRef, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
import { ShowComponent } from './show/show.component';
// import { DUMMY_SHOWS } from './dummy-shows';
import { Show } from './show/show.model';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-shows',
  imports: [ShowComponent],
  templateUrl: './shows.component.html',
  styleUrl: './shows.component.css',
})
export class ShowsComponent implements OnInit {
  @Input({ required: true }) movieId!: number;
  @Output() buyTicket = new EventEmitter<Show>();
  private httpClient = inject(HttpClient);
  private destroyRef = inject(DestroyRef);

  shows = signal<Show[] | undefined>(undefined);

  ngOnInit() {
    const subscribtion = this.httpClient
    .get<Show[]>('http://localhost:8080/shows')
    .subscribe({
      next: (redData) => {
        this.shows.set(redData);
      }
    })
  }

  get selectedShows() {
    return this.shows()?.filter((show) => show.movieId === this.movieId);
  }

  onBuyTicket(show: Show){
    this.buyTicket.emit(show);
  }
}
