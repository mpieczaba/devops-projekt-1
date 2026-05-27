import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api.config';
import { Show } from '../../../shared/models/domain.models';
import { ShowRepository } from './show.repository';

@Injectable()
export class HttpShowRepository extends ShowRepository {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = inject(API_BASE_URL);

  findAll(): Observable<Show[]> {
    return this.http.get<Show[]>(`${this.apiUrl}/shows`);
  }
}
