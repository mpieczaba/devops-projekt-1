import { Observable } from 'rxjs';
import { Seat } from '../../../shared/models/domain.models';

export abstract class SeatRepository {
  abstract findByShowId(showId: number): Observable<Seat[]>;
}
