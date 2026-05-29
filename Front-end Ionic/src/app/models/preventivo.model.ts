export interface Preventivo {
  id: number;

  descrizione: string;

  servizio: string;

  materiale: string;

  dimensioni: string;

  finitura: string;

  stato:
    | 'In attesa'
    | 'Prezzo proposto'
    | 'Accettato dal cliente'
    | 'Rifiutato'
    | 'Rifiutato dal cliente'
    | 'In lavorazione'
    | 'Completato';

  dataRichiesta: string;

  cliente?: string;

  emailCliente?: string;

  allegato?: string;

  prezzoProposto?: number | null;
}