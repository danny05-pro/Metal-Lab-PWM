import { HttpInterceptorFn } from '@angular/common/http';

const API_BASE_URL = 'http://localhost:3000/api';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = sessionStorage.getItem('token')?.replace(/^"(.*)"$/, '$1');

  if (!token || !req.url.startsWith(API_BASE_URL)) {
    return next(req);
  }

  return next(req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  }));
};
