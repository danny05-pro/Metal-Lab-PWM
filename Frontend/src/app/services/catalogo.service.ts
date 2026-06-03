import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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

  // Questo metodo crea gli header SOLO con il token. 
  // NIENTE "Content-Type: application/json" qui!
  private getAuthHeaders(): HttpHeaders {
    let token = sessionStorage.getItem('token') || '';
    token = token.replace(/^"(.*)"$/, '$1');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // --- LE CHIAMATE ---

  getCatalogo(): Observable<any[]> {
    // Per la GET usiamo il formato standard
    return this.http.get<any[]>(`${this.apiUrl}/catalogo`, { headers: this.getAuthHeaders() });
  }

  creaVoce(formData: FormData): Observable<any> {
    // Per i file, NON passare Content-Type. HttpClient lo farà per te.
    return this.http.post<any>(`${this.apiUrl}/admin/catalogo`, formData, { 
      headers: this.getAuthHeaders() 
    });
  }

  modificaVoce(id: number, formData: FormData): Observable<any> {
    // Anche qui, inviamo FormData.
    return this.http.put<any>(`${this.apiUrl}/admin/catalogo/${id}`, formData, { 
      headers: this.getAuthHeaders() 
    });
  }

  eliminaVoce(id: number): Observable<any> {
    // Qui serve il Content-Type perché non mandiamo file
    const headers = this.getAuthHeaders().set('Content-Type', 'application/json');
    return this.http.delete<any>(`${this.apiUrl}/admin/catalogo/${id}`, { headers });
  }

  // --- PREFERITI ---
  getPreferiti(): Observable<number[]> {
    return this.http.get<number[]>(`${this.apiUrl}/preferiti`, { headers: this.getAuthHeaders() });
  }

  aggiungiPreferito(id: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/preferiti/${id}`, {}, { headers: this.getAuthHeaders() });
  }

  rimuoviPreferito(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/preferiti/${id}`, { headers: this.getAuthHeaders() });
  }
}