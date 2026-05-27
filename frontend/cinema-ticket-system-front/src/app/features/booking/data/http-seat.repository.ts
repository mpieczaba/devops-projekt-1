import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api.config';
import { Seat } from '../../../shared/models/domain.models';
import { SeatRepository } from './seat.repository';

@Injectable()
export class HttpSeatRepository extends SeatRepository {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = inject(API_BASE_URL);

  findByShowId(showId: number): Observable<Seat[]> {
    return this.http.get<Seat[]>(`${this.apiUrl}/shows/${showId}/seats`);
  }
}
