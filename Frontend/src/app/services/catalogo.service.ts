import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface VoceCatalogo {
  id?: number;
  nome: string;
  categoria: string;
  prezzo_base?: string;
  prezzoBase?: string;
  immagine?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CatalogoService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  // --- LE CHIAMATE ---

  getCatalogo(): Observable<any[]> {
    // Per la GET usiamo il formato standard
    return this.http.get<any[]>(`${this.apiUrl}/catalogo`);
  }

  creaVoce(formData: FormData): Observable<any> {
    // Per i file, NON passare Content-Type. HttpClient lo farà per te.
    return this.http.post<any>(`${this.apiUrl}/admin/catalogo`, formData);
  }

  modificaVoce(id: number, formData: FormData): Observable<any> {
    // Anche qui, inviamo FormData.
    return this.http.put<any>(`${this.apiUrl}/admin/catalogo/${id}`, formData);
  }

  eliminaVoce(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/admin/catalogo/${id}`);
  }

  // --- PREFERITI ---
  getPreferiti(): Observable<number[]> {
    return this.http.get<number[]>(`${this.apiUrl}/preferiti`);
  }

  aggiungiPreferito(id: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/preferiti/${id}`, {});
  }

  rimuoviPreferito(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/preferiti/${id}`);
  }
}
