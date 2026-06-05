import { HttpErrorResponse } from '@angular/common/http';
import { ApiErrorResponse } from '../models/api.model';

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
