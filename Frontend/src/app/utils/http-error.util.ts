import { HttpErrorResponse } from '@angular/common/http';
import { ApiErrorResponse } from '../models/api.model';


//funzione riutilizzabile che estrae il messaggio da une errore http.

export function getHttpErrorMessage(
  error: HttpErrorResponse,
  fallback: string
): string {
  if (typeof error.error === 'string') {
    return error.error || fallback;
  }

  const response = error.error as ApiErrorResponse | null;
  return response?.message || fallback;
}
