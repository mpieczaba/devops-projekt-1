import { Observable } from 'rxjs';
import { ReservationResult } from '../../../shared/models/domain.models';

export interface CreateReservationCommand {
  showId: number;
  seatIds: number[];
}

export abstract class ReservationRepository {
  abstract create(command: CreateReservationCommand): Observable<ReservationResult>;
}
