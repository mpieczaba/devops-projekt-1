import { Observable } from 'rxjs';
import { Movie } from '../../../shared/models/domain.models';

export abstract class MovieRepository {
  abstract findAll(): Observable<Movie[]>;
}
