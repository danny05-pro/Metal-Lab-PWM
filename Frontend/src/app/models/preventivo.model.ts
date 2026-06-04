export type PreventivoStatoAdmin =
  | 'Da valutare'
  | 'Prezzo proposto'
  | 'Rifiutato'
  | 'Preventivo concordato';

export type PreventivoStatoRispostaCliente =
  | 'In attesa'
  | 'Accettato'
  | 'Rifiutato';

export interface Preventivo {
  id: number;

  cliente_id?: number;

  descrizione: string;

  servizio: string;

  materiale: string;

  dimensioni: string;

  finitura: string | null;

  allegato?: string | null;

  prezzo_proposto?: number | null;

  stato_admin: PreventivoStatoAdmin;

  stato_risposta_cliente: PreventivoStatoRispostaCliente;

  // I campi uniti tramite JOIN (quando l'admin legge i dati)
  cliente_nome?: string;

  cliente_cognome?: string;

  cliente_email?: string;

  cliente_telefono?: string;

  // Alias storici usati da alcune pagine/mock del frontend.
  cliente?: string;

  emailCliente?: string;

  prezzoProposto?: number | null;
}
