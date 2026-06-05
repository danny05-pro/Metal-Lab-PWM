import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  CatalogoCreateResponse,
  CatalogoItem,
  CatalogoMessageResponse
} from '../models/catalogo.model';

export type VoceCatalogo = CatalogoItem;

@Injectable({
  providedIn: 'root'
})
export class CatalogoService {
  constructor(private http: HttpClient) {}

  // --- LE CHIAMATE ---

  getCatalogo(): Observable<VoceCatalogo[]> {
    // Per la GET usiamo il formato standard
    return this.http.get<VoceCatalogo[]>('/catalogo');
  }

  creaVoce(formData: FormData): Observable<CatalogoCreateResponse> {
    // Per i file, NON passare Content-Type. HttpClient lo farà per te.
    return this.http.post<CatalogoCreateResponse>('/admin/catalogo', formData);
  }

  modificaVoce(id: number, formData: FormData): Observable<CatalogoMessageResponse> {
    // Anche qui, inviamo FormData.
    return this.http.put<CatalogoMessageResponse>(`/admin/catalogo/${id}`, formData);
  }

  eliminaVoce(id: number): Observable<CatalogoMessageResponse> {
    return this.http.delete<CatalogoMessageResponse>(`/admin/catalogo/${id}`);
  }

  // --- PREFERITI ---
  getPreferiti(): Observable<number[]> {
    return this.http.get<number[]>('/preferiti');
  }

  aggiungiPreferito(id: number): Observable<CatalogoMessageResponse> {
    return this.http.post<CatalogoMessageResponse>(`/preferiti/${id}`, {});
  }

  rimuoviPreferito(id: number): Observable<CatalogoMessageResponse> {
    return this.http.delete<CatalogoMessageResponse>(`/preferiti/${id}`);
  }
}
