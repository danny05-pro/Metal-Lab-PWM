export interface Intervento {
  id: number;

  cliente_id?: number;

  descrizione: string;

  luogo: string;

  priorita: 'Bassa' | 'Media' | 'Alta';

  stato_admin:
    | 'Intervento concordato'
    | 'Richiesto'
    | 'Rifiutato'
    | 'Data proposta'
    | 'In attesa nuova valutazione';

  stato_risposta_cliente:
    | 'In attesa'
    | 'Data accettata'
    | 'Nuova data proposta'
    | 'Intervento annullato';

  stato_lavorazione:
    | 'Da programmare'
    | 'Programmato'
    | 'In lavorazione'
    | 'Terminato';

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
  data_richiesta?: string;

  data_proposta_cliente?: string;

  data_proposta_admin?: string;

  data_accettata?: string;

  created_at?: string;

  updated_at?: string;

  // Tabella ponte dipendenti_interventi
  dipendentiAssegnati?: string[];
}