import { Injectable, computed, inject, signal } from '@angular/core';
import { Movie, Show } from '../../../shared/models/domain.models';
import { MovieRepository } from '../data/movie.repository';
import { ShowRepository } from '../data/show.repository';

@Injectable()
export class RepertoireFacade {
  private readonly movieRepository = inject(MovieRepository);
  private readonly showRepository = inject(ShowRepository);

  private readonly moviesState = signal<Movie[] | undefined>(undefined);
  private readonly showsState = signal<Show[] | undefined>(undefined);
  private readonly errorState = signal<string | null>(null);

  readonly movies = this.moviesState.asReadonly();
  readonly shows = this.showsState.asReadonly();
  readonly error = this.errorState.asReadonly();
  readonly isLoading = computed(
    () => this.moviesState() === undefined || this.showsState() === undefined
  );

  load(): void {
    this.errorState.set(null);

    this.movieRepository.findAll().subscribe({
      next: (movies) => this.moviesState.set(movies),
      error: () => this.errorState.set('Nie udało się pobrać repertuaru.'),
    });

    this.showRepository.findAll().subscribe({
      next: (shows) => this.showsState.set(shows),
      error: () => this.errorState.set('Nie udało się pobrać seansów.'),
    });
  }

  showsForMovie(movieId: number): Show[] {
    return this.showsState()?.filter((show) => show.movieId === movieId) ?? [];
  }
}
