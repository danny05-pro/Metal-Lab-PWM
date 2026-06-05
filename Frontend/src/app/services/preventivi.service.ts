import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Preventivo,
  PreventivoCreateResponse,
  PreventivoRichiesta
} from '../models/preventivo.model';

export type { PreventivoRichiesta } from '../models/preventivo.model';

@Injectable({
  providedIn: 'root'
})
export class PreventiviService {

  private apiUrl = 'http://localhost:3000/api/preventivi';
  // 1. Aggiungiamo la base URL per l'admin per comodità
  private adminApiUrl = 'http://localhost:3000/api/admin/preventivi'; 

  constructor(private http: HttpClient) {}

  // 2. Modifica creaPreventivo per accettare FormData
  creaPreventivo(dati: FormData): Observable<PreventivoCreateResponse> {
    return this.http.post<PreventivoCreateResponse>(this.apiUrl, dati);
  }

  getPreventivi(): Observable<Preventivo[]> {
    return this.http.get<Preventivo[]>(this.apiUrl);
  }
  
  getPreventiviAdmin(): Observable<Preventivo[]> {
    return this.http.get<Preventivo[]>(this.adminApiUrl);
  }

  // 2. NUOVA FUNZIONE: Recupera il dettaglio di un singolo preventivo per l'ADMIN
  getPreventivoAdminById(id: number | string): Observable<Preventivo> {
    return this.http.get<Preventivo>(`${this.adminApiUrl}/${id}`);
  }

  adminProponePrezzo(id: number | string, prezzo: number): Observable<any> {
    return this.http.patch(`${this.adminApiUrl}/${id}/proponi-prezzo`, { prezzo });
  }

  // Admin rifiuta il preventivo
  adminRifiutaPreventivo(id: number | string): Observable<any> {
    return this.http.patch(`${this.adminApiUrl}/${id}/rifiuta`, {});
  }

  // Recupera il dettaglio di un singolo preventivo per il CLIENTE
  getPreventivoClienteById(id: number | string): Observable<Preventivo> {
    return this.http.get<Preventivo>(`${this.apiUrl}/${id}`);
  }

  // Invia al backend la scelta del cliente (accetta o rifiuta)
  rispondiPreventivo(id: number | string, azione: 'accetta' | 'rifiuta'): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/risposta`, { azione });
  }
}
