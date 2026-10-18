import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { authInterceptor } from './core/auth/auth.interceptor';
import { API_BASE_URL } from './core/config/api.config';
import { MovieRepository } from './features/repertoire/data/movie.repository';
import { HttpMovieRepository } from './features/repertoire/data/http-movie.repository';
import { ShowRepository } from './features/repertoire/data/show.repository';
import { HttpShowRepository } from './features/repertoire/data/http-show.repository';
import { SeatRepository } from './features/booking/data/seat.repository';
import { HttpSeatRepository } from './features/booking/data/http-seat.repository';
import { ReservationRepository } from './features/booking/data/reservation.repository';
import { HttpReservationRepository } from './features/booking/data/http-reservation.repository';
import { TicketValidatorRepository } from './features/ticket-validation/data/ticket-validator.repository';
import { HttpTicketValidatorRepository } from './features/ticket-validation/data/http-ticket-validator.repository';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    { provide: API_BASE_URL, useValue: '/api' },
    { provide: MovieRepository, useClass: HttpMovieRepository },
    { provide: ShowRepository, useClass: HttpShowRepository },
    { provide: SeatRepository, useClass: HttpSeatRepository },
    { provide: ReservationRepository, useClass: HttpReservationRepository },
    { provide: TicketValidatorRepository, useClass: HttpTicketValidatorRepository },
  ],
};
