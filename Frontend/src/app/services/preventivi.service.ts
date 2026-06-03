import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Preventivo } from '../models/preventivo.model';

export interface PreventivoRichiesta {
  descrizione: string;
  servizio: string;
  materiale: string;
  dimensioni: string;
  finitura?: string;
  allegato?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PreventiviService {

  private apiUrl = 'http://localhost:3000/api/preventivi';
  // 1. Aggiungiamo la base URL per l'admin per comodità
  private adminApiUrl = 'http://localhost:3000/api/admin/preventivi'; 

  constructor(private http: HttpClient) {}

// 1. Sostituisci getHeaders togliendo il Content-Type
  private getHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  // 2. Modifica creaPreventivo per accettare FormData
  creaPreventivo(dati: FormData): Observable<any> {
    return this.http.post(this.apiUrl, dati, { headers: this.getHeaders() });
  }

  getPreventivi(): Observable<Preventivo[]> {
    return this.http.get<Preventivo[]>(this.apiUrl, { headers: this.getHeaders() });
  }
  
  getPreventiviAdmin(): Observable<Preventivo[]> {
    return this.http.get<Preventivo[]>(this.adminApiUrl, { headers: this.getHeaders() });
  }

  // 2. NUOVA FUNZIONE: Recupera il dettaglio di un singolo preventivo per l'ADMIN
  getPreventivoAdminById(id: number | string): Observable<any> {
    return this.http.get<any>(`${this.adminApiUrl}/${id}`, { headers: this.getHeaders() });
  }

  adminProponePrezzo(id: number | string, prezzo: number): Observable<any> {
    return this.http.put(`${this.adminApiUrl}/${id}/proponi-prezzo`, { prezzo }, { headers: this.getHeaders() });
  }

  // Admin rifiuta il preventivo
  adminRifiutaPreventivo(id: number | string): Observable<any> {
    return this.http.put(`${this.adminApiUrl}/${id}/rifiuta`, {}, { headers: this.getHeaders() });
  }

  // Recupera il dettaglio di un singolo preventivo per il CLIENTE
  getPreventivoClienteById(id: number | string): Observable<Preventivo> {
    return this.http.get<Preventivo>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  // Invia al backend la scelta del cliente (accetta o rifiuta)
  rispondiPreventivo(id: number | string, azione: 'accetta' | 'rifiuta'): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/risposta`, { azione }, { headers: this.getHeaders() });
  }
}