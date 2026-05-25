import { Component, Input } from '@angular/core';
import { Movie } from './movie.model';

@Component({
  selector: 'app-movie',
  imports: [],
  templateUrl: './movie.component.html',
  styleUrl: './movie.component.css',
})
export class MovieComponent {
  @Input({required: true}) movie!: Movie;
  
}
