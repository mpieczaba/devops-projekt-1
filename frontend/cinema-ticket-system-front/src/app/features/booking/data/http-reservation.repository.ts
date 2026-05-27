import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api.config';
import { ReservationResult } from '../../../shared/models/domain.models';
import {
  CreateReservationCommand,
  ReservationRepository,
} from './reservation.repository';

@Injectable()
export class HttpReservationRepository extends ReservationRepository {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = inject(API_BASE_URL);

  create(command: CreateReservationCommand): Observable<ReservationResult> {
    return this.http.post<ReservationResult>(`${this.apiUrl}/reservations`, command);
  }
}
