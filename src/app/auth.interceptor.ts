import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, catchError, finalize, map, shareReplay, switchMap, throwError } from 'rxjs';
import { AuthService } from './services/auth.service';

let refreshInFlight$: Observable<string> | null = null;

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  if (req.url.startsWith('/api/auth/refresh')) {
    return next(req);
  }

  const token = authService.getToken();

  const requiresJwt =
    req.url.startsWith('/api/customers') ||
    req.url.startsWith('/api/auth/me') ||
    req.url.startsWith('/api/auth/logout');
  if (!requiresJwt) {
    return next(req);
  }

  if (!token) {
    return throwError(
      () =>
        new HttpErrorResponse({
          status: 401,
          statusText: 'Unauthorized',
          error: { message: 'JWT no encontrado. Inicia sesión nuevamente.' }
        })
    );
  }

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (!requiresJwt || error.status !== 401 || !authService.hasRefreshToken()) {
        return throwError(() => error);
      }

      if (!refreshInFlight$) {
        refreshInFlight$ = authService.refresh().pipe(
          map((response) => response.token),
          shareReplay(1),
          finalize(() => {
            refreshInFlight$ = null;
          }),
          catchError((refreshError) => {
            authService.clearSession();
            return throwError(() => refreshError);
          })
        );
      }

      return refreshInFlight$.pipe(
        switchMap((newToken) => {
          const retryReq = req.clone({
            setHeaders: {
              Authorization: `Bearer ${newToken}`
            }
          });

          return next(retryReq);
        })
      );
    })
  );
};
