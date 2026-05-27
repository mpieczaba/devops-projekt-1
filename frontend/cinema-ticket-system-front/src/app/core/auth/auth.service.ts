import { computed, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';
import { inject } from '@angular/core';

interface Credentials {
  username: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = inject(API_BASE_URL);
  private readonly credentials = signal<Credentials | null>(null);

  readonly isLoggedIn = computed(() => this.credentials() !== null);
  readonly username = computed(() => this.credentials()?.username ?? null);

  getAuthHeader(): string | null {
    const creds = this.credentials();
    return creds ? `Basic ${btoa(`${creds.username}:${creds.password}`)}` : null;
  }

  login(username: string, password: string): Observable<boolean> {
    const header = `Basic ${btoa(`${username}:${password}`)}`;

    return this.http
      .get(`${this.apiUrl}/ticket-validators/info`, {
        params: { code: '__login_probe__' },
        headers: { Authorization: header },
        observe: 'response',
      })
      .pipe(
        map(() => {
          this.credentials.set({ username, password });
          return true;
        }),
        catchError((error) => {
          if (error.status === 404) {
            this.credentials.set({ username, password });
            return of(true);
          }
          if (error.status === 401 || error.status === 403) {
            return of(false);
          }
          return throwError(() => error);
        })
      );
  }

  logout(): void {
    this.credentials.set(null);
  }
}
