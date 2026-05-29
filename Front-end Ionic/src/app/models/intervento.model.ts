export interface Intervento {
  id: number;

  descrizione: string;

  luogo: string;

  priorita: 'Bassa' | 'Media' | 'Alta';

  stato:
    | 'Richiesto'
    | 'Da assegnare'
    | 'Assegnato'
    | 'Programmato'
    | 'Terminato';

  dataOra: string;

  cliente?: string;

  emailCliente?: string;

  telefonoCliente?: string;

  dataRichiesta?: string;

  dataPreferita?: string;

  dipendenteAssegnato?: string | null;

  note?: string;
}