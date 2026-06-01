import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

// L'interfaccia che definisce i dati esatti che il frontend spedirà al backend
export interface InterventoRichiesta {
  descrizione: string;
  luogo: string;
  priorita: string;
  data_preferita?: string;
}

@Injectable({
  providedIn: 'root'
})
export class InterventiService {
  
  // L'indirizzo esatto che abbiamo configurato nel backend
  private apiUrl = 'http://localhost:3000/api/auth/interventi';

  constructor(private http: HttpClient) {}

  // Funzione per recuperare il token del cliente e farsi riconoscere dal server
  private getHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token'); 
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // Chiamata POST per creare una nuova richiesta nel database
  creaIntervento(dati: InterventoRichiesta): Observable<any> {
    return this.http.post(this.apiUrl, dati, { headers: this.getHeaders() });
  }

  getInterventiCliente(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() });
  }
}