import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api.config';
import { Movie } from '../../../shared/models/domain.models';
import { MovieRepository } from './movie.repository';

@Injectable()
export class HttpMovieRepository extends MovieRepository {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = inject(API_BASE_URL);

  findAll(): Observable<Movie[]> {
    return this.http.get<Movie[]>(`${this.apiUrl}/movies`);
  }
}
