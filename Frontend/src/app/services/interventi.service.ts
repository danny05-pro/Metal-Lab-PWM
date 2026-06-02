import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Intervento } from 'src/app/models/intervento.model';

export interface InterventoRichiesta {
  descrizione: string;
  luogo: string;
  priorita: 'Bassa' | 'Media' | 'Alta';
  data_proposta_cliente?: string;
}

@Injectable({
  providedIn: 'root'
})
export class InterventiService {

  private apiUrl = 'http://localhost:3000/api/interventi';
  private adminApiUrl = 'http://localhost:3000/api/admin/interventi';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token');

    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });
  }

  creaIntervento(dati: InterventoRichiesta): Observable<any> {
    return this.http.post(
      this.apiUrl,
      dati,
      {
        headers: this.getHeaders()
      }
    );
  }

  getInterventiCliente(): Observable<Intervento[]> {
    return this.http.get<Intervento[]>(
      this.apiUrl,
      {
        headers: this.getHeaders()
      }
    );
  }

  getInterventiAdmin(): Observable<Intervento[]> {
    return this.http.get<Intervento[]>(
      this.adminApiUrl,
      {
        headers: this.getHeaders()
      }
    );
  }

  getInterventoAdminById(id: number | string): Observable<Intervento> {
    return this.http.get<Intervento>(
      `${this.adminApiUrl}/${id}`,
      {
        headers: this.getHeaders()
      }
    );
  }
}