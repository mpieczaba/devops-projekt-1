import { Observable } from 'rxjs';
import { TicketValidationInfo } from '../../../shared/models/domain.models';

export abstract class TicketValidatorRepository {
  abstract getInfo(code: string): Observable<TicketValidationInfo>;
  abstract redeem(code: string): Observable<void>;
}
