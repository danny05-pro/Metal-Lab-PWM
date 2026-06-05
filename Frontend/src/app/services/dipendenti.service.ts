import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Dipendente, DipendenteRequest } from '../models/user.model';
import { ApiMessageResponse } from '../models/api.model';

export type { Dipendente } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class DipendentiService {
  
  private apiUrl = '/gestione-dipendenti';

  constructor(private http: HttpClient) {}

  // ==========================================
  // CHIAMATE HTTP
  // ==========================================

  getDipendenti(): Observable<Dipendente[]> {
    return this.http.get<Dipendente[]>(this.apiUrl);
  }

  creaDipendente(dati: DipendenteRequest): Observable<Dipendente> {
    return this.http.post<Dipendente>(this.apiUrl, dati);
  }

  modificaDipendente(id: number, dati: DipendenteRequest): Observable<ApiMessageResponse> {
    return this.http.put<ApiMessageResponse>(`${this.apiUrl}/${id}`, dati);
  }

  eliminaDipendente(id: number): Observable<ApiMessageResponse> {
    return this.http.delete<ApiMessageResponse>(`${this.apiUrl}/${id}`);
  }
}
