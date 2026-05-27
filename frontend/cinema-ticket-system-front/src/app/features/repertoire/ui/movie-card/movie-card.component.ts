import { Component, Input } from '@angular/core';
import { Movie } from '../../../../shared/models/domain.models';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.css',
})
export class MovieCardComponent {
  @Input({ required: true }) movie!: Movie;
}
