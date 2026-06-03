export interface Preventivo {
  id: number;

  cliente_id?: number;

  descrizione: string;

  servizio: string;

  materiale: string;

  dimensioni: string;

  finitura: string;

  // --- STATO LATO ADMIN ---
  stato_admin:
    | 'Da valutare'
    | 'Prezzo proposto'
    | 'Rifiutato';

  // --- STATO LATO CLIENTE ---
  stato_risposta_cliente:
    | 'In attesa'
    | 'Accettato'
    | 'Rifiutato';

  // I campi uniti tramite JOIN (quando l'admin legge i dati)
  cliente?: string; 

  emailCliente?: string;

  cliente_nome?: string;

  cliente_cognome?: string;

  cliente_telefono?: string;

  allegato?: string;

  prezzoProposto?: number | null;
}