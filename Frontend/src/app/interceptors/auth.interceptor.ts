import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

const API_BASE_URL = 'http://localhost:3000/api';
const PUBLIC_AUTH_URLS = [
  '/auth/login',
  '/auth/register'
];

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const token = sessionStorage.getItem('token')?.replace(/^"(.*)"$/, '$1');
  const isRelativeApiRequest = req.url.startsWith('/') && !req.url.startsWith('//');

  if (!isRelativeApiRequest) {
    return next(req);
  }

  const isPublicAuthRequest = PUBLIC_AUTH_URLS.includes(req.url);

  const apiRequest = req.clone({
    url: `${API_BASE_URL}${req.url}`,
    setHeaders: token && !isPublicAuthRequest
      ? { Authorization: `Bearer ${token}` }
      : {}
  });

  return next(apiRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      if (!isPublicAuthRequest && sessioneNonValida(error)) {
        svuotaSessione();

        console.error('Sessione scaduta o non autorizzata. Redirect al login.');

        if (router.url !== '/login') {
          void router.navigate(['/login']);
        }
      } else if (!isPublicAuthRequest && error.status === 403) {
        console.error('Accesso negato: non hai i permessi per questa risorsa.');

        const dashboard = dashboardPerRuolo();

        if (router.url !== dashboard) {
          void router.navigate([dashboard]);
        }
      }

      return throwError(() => error);
    })
  );
};

function sessioneNonValida(error: HttpErrorResponse): boolean {
  return error.status === 401;
}

function svuotaSessione(): void {
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('utenteLoggato');
  sessionStorage.removeItem('ruoloUtente');
  sessionStorage.removeItem('nomeUtente');
}

function dashboardPerRuolo(): string {
  const ruolo = sessionStorage.getItem('ruoloUtente');

  if (ruolo === 'admin') {
    return '/dashboard-admin';
  }

  if (ruolo === 'dipendente') {
    return '/dashboard-dipendente';
  }

  if (ruolo === 'cliente') {
    return '/dashboard-cliente';
  }

  return '/home';
}
