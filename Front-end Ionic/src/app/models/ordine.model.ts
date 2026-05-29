export interface Ordine {
  id: number;

  descrizione: string;

  stato:
    | 'In attesa'
    | 'In lavorazione'
    | 'Pronto per il ritiro'
    | 'Consegnato';

  dataConsegnaPrevista: string;

  cliente?: string;

  emailCliente?: string;

  dataOrdine?: string;

  importoTotale?: number;

  note?: string;
}