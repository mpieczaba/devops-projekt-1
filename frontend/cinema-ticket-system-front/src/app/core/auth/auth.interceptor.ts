import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

const PROTECTED_PATHS = ['/ticket-validators/', '/tickets/valid'];

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authHeader = inject(AuthService).getAuthHeader();

  if (!authHeader || !PROTECTED_PATHS.some((path) => req.url.includes(path))) {
    return next(req);
  }

  return next(req.clone({ setHeaders: { Authorization: authHeader } }));
};
