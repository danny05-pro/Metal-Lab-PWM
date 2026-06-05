import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  DipendenteAssegnato,
  Intervento,
  InterventoCreateResponse,
  InterventoRichiesta,
  InterventoStatoLavorazione
} from 'src/app/models/intervento.model';

export type { InterventoRichiesta } from 'src/app/models/intervento.model';

@Injectable({
  providedIn: 'root'
})
export class InterventiService {
  private apiUrl = '/interventi';
  private adminApiUrl = '/admin/interventi';

  constructor(private http: HttpClient) {}

  creaIntervento(dati: InterventoRichiesta): Observable<InterventoCreateResponse> {
    return this.http.post<InterventoCreateResponse>(this.apiUrl, dati);
  }

  getInterventiCliente(): Observable<Intervento[]> {
    return this.http.get<Intervento[]>(this.apiUrl);
  }

  getInterventoClienteById(id: number | string): Observable<Intervento> {
    return this.http.get<Intervento>(`${this.apiUrl}/${id}`);
  }

  getInterventiAdmin(): Observable<Intervento[]> {
    return this.http.get<Intervento[]>(this.adminApiUrl);
  }

  getInterventoAdminById(id: number | string): Observable<Intervento> {
    return this.http.get<Intervento>(`${this.adminApiUrl}/${id}`);
  }

  adminProponeData(
    interventoId: number | string,
    dati: {
      data_proposta_admin?: string;
      usa_data_cliente?: boolean;
    }
  ): Observable<any> {
    return this.http.patch(`${this.adminApiUrl}/${interventoId}/proponi-data`, dati);
  }

  adminRifiutaIntervento(interventoId: number | string): Observable<any> {
    return this.http.patch(`${this.adminApiUrl}/${interventoId}/rifiuta`, {});
  }

  clienteRispondeData(
    interventoId: number | string,
    dati: {
      azione: 'accetta_data' | 'proponi_nuova_data' | 'annulla_intervento';
      nuova_data?: string;
    }
  ): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${interventoId}/risposta-cliente`, dati);
  }

  assegnaDipendente(
    interventoId: number | string,
    dipendenteId: number | string
  ): Observable<any> {
    return this.http.post(`${this.adminApiUrl}/${interventoId}/dipendenti`, {
      dipendente_id: dipendenteId
    });
  }

  getDipendentiAssegnati(interventoId: number | string): Observable<DipendenteAssegnato[]> {
    return this.http.get<DipendenteAssegnato[]>(`${this.adminApiUrl}/${interventoId}/dipendenti`);
  }

  getDipendentiDisponibili(): Observable<DipendenteAssegnato[]> {
    return this.http.get<DipendenteAssegnato[]>('/gestione-dipendenti');
  }

  getInterventiDipendente(): Observable<Intervento[]> {
    return this.http.get<Intervento[]>('/dipendente/interventi');
  }

  getInterventoDipendenteById(id: number | string): Observable<Intervento> {
    return this.http.get<Intervento>(`/dipendente/interventi/${id}`);
  }

  aggiornaStatoLavorazioneDipendente(
    interventoId: number | string,
    stato_lavorazione: Extract<InterventoStatoLavorazione, 'Programmato' | 'In lavorazione' | 'Terminato'>
  ): Observable<any> {
    return this.http.patch(`/dipendente/interventi/${interventoId}/stato`, {
      stato_lavorazione
    });
  }

  aggiornaDipendentiAssegnati(
    interventoId: number | string,
    dipendenteIds: number[]
  ): Observable<any> {
    return this.http.put(`${this.adminApiUrl}/${interventoId}/dipendenti`, {
      dipendente_ids: dipendenteIds
    });
  }
}
