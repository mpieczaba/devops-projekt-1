import { Component } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { MoviesComponent } from './movies/movies.component';
import { RoomComponent } from './room/room.component';
import { Show } from './movies/shows/show/show.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, MoviesComponent, RoomComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  show?: Show;
  chosenSeats?: number[];

  onBuyTicket(show: Show) {
    this.show = show;
  }

  onSeats(seats: number[]) {
    this.chosenSeats = seats;
  }

  onConfirmSeats() {
    console.log(
      JSON.stringify({
        show: this.show?.id,
        seats: this.chosenSeats,
      }),
    );
  }
}
