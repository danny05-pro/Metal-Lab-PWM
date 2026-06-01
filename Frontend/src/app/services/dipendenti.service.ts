import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

// Tipizziamo il dipendente per mantenere il codice rigoroso
export interface Dipendente {
  id?: number; 
  nome: string;
  cognome: string;
  email: string;
  telefono: string; 
  stato?: string; 
  password?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DipendentiService {
  
  // Assicurati che l'indirizzo corrisponda alle tue rotte sul backend
  private apiUrl = 'http://localhost:3000/api/auth/gestione-dipendenti';

  constructor(private http: HttpClient) {}

  // Funzione interna per generare gli header con il token
  private getHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token'); 
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // ==========================================
  // CHIAMATE HTTP
  // ==========================================

  getDipendenti(): Observable<Dipendente[]> {
    return this.http.get<Dipendente[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  creaDipendente(dati: Dipendente): Observable<Dipendente> {
    return this.http.post<Dipendente>(this.apiUrl, dati, { headers: this.getHeaders() });
  }

  modificaDipendente(id: number, dati: Dipendente): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, dati, { headers: this.getHeaders() });
  }

  eliminaDipendente(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}