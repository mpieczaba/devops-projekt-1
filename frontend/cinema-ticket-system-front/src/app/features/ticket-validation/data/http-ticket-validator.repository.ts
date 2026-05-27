import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api.config';
import { TicketValidationInfo } from '../../../shared/models/domain.models';
import { TicketValidatorRepository } from './ticket-validator.repository';

@Injectable()
export class HttpTicketValidatorRepository extends TicketValidatorRepository {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = inject(API_BASE_URL);

  getInfo(code: string): Observable<TicketValidationInfo> {
    const params = new HttpParams().set('code', code);
    return this.http.get<TicketValidationInfo>(`${this.apiUrl}/ticket-validators/info`, {
      params,
    });
  }

  redeem(code: string): Observable<void> {
    const params = new HttpParams().set('code', code);
    return this.http.post<void>(`${this.apiUrl}/ticket-validators/scan-ticket`, null, {
      params,
    });
  }
}
