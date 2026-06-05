import { Dipendente } from './user.model';

export type InterventoPriorita =
  | 'Bassa'
  | 'Media'
  | 'Alta';

export type InterventoStatoAdmin =
  | 'Richiesto'
  | 'Rifiutato'
  | 'Data proposta'
  | 'In attesa nuova valutazione'
  | 'Intervento concordato';

export type InterventoStatoRispostaCliente =
  | 'In attesa'
  | 'Data accettata'
  | 'Nuova data proposta'
  | 'Intervento annullato';

export type InterventoStatoLavorazione =
  | 'Da programmare'
  | 'Programmato'
  | 'In lavorazione'
  | 'Terminato';

export type DipendenteAssegnato = Dipendente;

export interface Intervento {
  id: number;

  cliente_id: number;

  descrizione: string;

  luogo: string;

  priorita: InterventoPriorita;

  stato_admin: InterventoStatoAdmin;

  stato_risposta_cliente: InterventoStatoRispostaCliente;

  stato_lavorazione: InterventoStatoLavorazione;

  // Campi reali restituiti dal backend nelle query admin con JOIN users
  cliente_nome?: string;

  cliente_cognome?: string;

  cliente_email?: string;

  cliente_telefono?: string;

  // Date del database
  data_richiesta?: string | null;

  data_proposta_cliente?: string | null;

  data_proposta_admin?: string | null;

  data_accettata?: string | null;

  dipendenti_assegnati?: DipendenteAssegnato[];

  numero_dipendenti?: number;
}

export interface InterventoRichiesta {
  descrizione: string;
  luogo: string;
  priorita: InterventoPriorita;
  data_proposta_cliente?: string;
}

export interface InterventoCreato {
  id: number;
  cliente_id: number;
  descrizione: string;
  luogo: string;
  priorita: InterventoPriorita;
  data_richiesta: string;
  data_proposta_cliente?: string | null;
}

export interface InterventoCreateResponse {
  message: string;
  intervento: InterventoCreato;
}
