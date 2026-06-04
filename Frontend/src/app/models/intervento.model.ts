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

export interface DipendenteAssegnato {
  id: number;

  nome: string;

  cognome: string;

  email: string;

  telefono?: string | null;

  ruolo: 'dipendente';
}

export interface Intervento {
  id: number;

  cliente_id?: number;

  descrizione: string;

  luogo: string;

  priorita: InterventoPriorita;

  stato_admin: InterventoStatoAdmin;

  stato_risposta_cliente: InterventoStatoRispostaCliente;

  stato_lavorazione: InterventoStatoLavorazione;

  // Campo di comodo usato in alcune viste frontend
  dataOra?: string;

  // Vecchi campi usati nei mock/pagine già esistenti
  cliente?: string;

  emailCliente?: string;

  telefonoCliente?: string;

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

  // Campi non presenti nello schema SQLite attuale, tenuti come alias legacy.
  created_at?: string;

  updated_at?: string;

  dipendentiAssegnati?: string[];

  dipendenti_assegnati?: DipendenteAssegnato[];

  numero_dipendenti?: number;
}
