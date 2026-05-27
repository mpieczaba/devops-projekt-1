import { Component, inject, signal } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { MoviesComponent } from './movies/movies.component';
import { RoomComponent } from './room/room.component';
import { Show } from './movies/shows/show/show.model';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, MoviesComponent, RoomComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  private httpClient = inject(HttpClient);
  show?: Show;
  chosenSeats?: number[];
  reservationCode = signal<string | undefined>(undefined);

  onBuyTicket(show: Show) {
    this.show = show;
  }

  onSeats(seats: number[]) {
    this.chosenSeats = seats;
  }

  onConfirmSeats() {
    const data = {
      showId: this.show?.id,
      seatIds: this.chosenSeats,
    };

    this.httpClient
      .post<{ id: number; code: string }>('http://localhost:8080/reservations', data)
      .subscribe({
        next: (resData) => this.reservationCode.set(resData.code),
      });
  }
}
