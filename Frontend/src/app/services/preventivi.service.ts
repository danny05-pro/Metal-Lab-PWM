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

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });
  }

  creaPreventivo(dati: PreventivoRichiesta): Observable<any> {
    return this.http.post(this.apiUrl, dati, { headers: this.getHeaders() });
  }

  getPreventivi(): Observable<Preventivo[]> {
    return this.http.get<Preventivo[]>(this.apiUrl, { headers: this.getHeaders() });
  }
  getPreventiviAdmin(): Observable<Preventivo[]> {
    const adminUrl = 'http://localhost:3000/api/admin/preventivi';
    return this.http.get<Preventivo[]>(adminUrl, { headers: this.getHeaders() });
  }
}