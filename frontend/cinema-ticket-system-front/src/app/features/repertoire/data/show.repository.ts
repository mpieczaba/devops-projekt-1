import { Observable } from 'rxjs';
import { Show } from '../../../shared/models/domain.models';

export abstract class ShowRepository {
  abstract findAll(): Observable<Show[]>;
}
