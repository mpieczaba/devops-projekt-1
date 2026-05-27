import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { Movie, Show } from '../../../shared/models/domain.models';
import { MovieRepository } from '../data/movie.repository';
import { ShowRepository } from '../data/show.repository';
import { RepertoireFacade } from './repertoire.facade';

class MovieRepositoryStub extends MovieRepository {
  findAll = vi.fn(() => of<Movie[]>([{ id: 1, title: 'Inception', description: '', durationMinutes: 120, imageUrl: 'inception.webp' }]));
}

class ShowRepositoryStub extends ShowRepository {
  findAll = vi.fn(() =>
    of<Show[]>([
      { id: 10, date: '2026-05-27T18:00:00', movieId: 1, roomId: 1 },
      { id: 11, date: '2026-05-27T21:00:00', movieId: 2, roomId: 1 },
    ])
  );
}

describe('RepertoireFacade', () => {
  let facade: RepertoireFacade;
  let movies: MovieRepositoryStub;
  let shows: ShowRepositoryStub;

  beforeEach(() => {
    movies = new MovieRepositoryStub();
    shows = new ShowRepositoryStub();

    TestBed.configureTestingModule({
      providers: [
        RepertoireFacade,
        { provide: MovieRepository, useValue: movies },
        { provide: ShowRepository, useValue: shows },
      ],
    });

    facade = TestBed.inject(RepertoireFacade);
  });

  it('loads movies and shows', () => {
    facade.load();

    expect(movies.findAll).toHaveBeenCalled();
    expect(shows.findAll).toHaveBeenCalled();
    expect(facade.movies()).toHaveLength(1);
    expect(facade.shows()).toHaveLength(2);
    expect(facade.isLoading()).toBe(false);
  });

  it('filters shows for selected movie', () => {
    facade.load();

    expect(facade.showsForMovie(1)).toHaveLength(1);
    expect(facade.showsForMovie(1)[0].id).toBe(10);
    expect(facade.showsForMovie(99)).toEqual([]);
  });

  it('sets error when movie loading fails', () => {
    movies.findAll.mockReturnValue(throwError(() => new Error('network')));

    facade.load();

    expect(facade.error()).toBe('Nie udało się pobrać repertuaru.');
  });
});
