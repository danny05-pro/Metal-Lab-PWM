import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  AdminPropostaDataRequest,
  ClienteRispostaDataRequest,
  DipendenteAssegnato,
  DipendentiAssignmentResponse,
  Intervento,
  InterventoActionResponse,
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
    dati: AdminPropostaDataRequest
  ): Observable<InterventoActionResponse> {
    return this.http.patch<InterventoActionResponse>(`${this.adminApiUrl}/${interventoId}/proponi-data`, dati);
  }

  adminRifiutaIntervento(interventoId: number | string): Observable<InterventoActionResponse> {
    return this.http.patch<InterventoActionResponse>(`${this.adminApiUrl}/${interventoId}/rifiuta`, {});
  }

  clienteRispondeData(
    interventoId: number | string,
    dati: ClienteRispostaDataRequest
  ): Observable<InterventoActionResponse> {
    return this.http.patch<InterventoActionResponse>(`${this.apiUrl}/${interventoId}/risposta-cliente`, dati);
  }

  assegnaDipendente(
    interventoId: number | string,
    dipendenteId: number | string
  ): Observable<DipendentiAssignmentResponse> {
    return this.http.post<DipendentiAssignmentResponse>(`${this.adminApiUrl}/${interventoId}/dipendenti`, {
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
  ): Observable<InterventoActionResponse> {
    return this.http.patch<InterventoActionResponse>(`/dipendente/interventi/${interventoId}/stato`, {
      stato_lavorazione
    });
  }

  aggiornaDipendentiAssegnati(
    interventoId: number | string,
    dipendenteIds: number[]
  ): Observable<DipendentiAssignmentResponse> {
    return this.http.put<DipendentiAssignmentResponse>(`${this.adminApiUrl}/${interventoId}/dipendenti`, {
      dipendente_ids: dipendenteIds
    });
  }
}
