export interface Intervento {
  id: number;

  descrizione: string;

  luogo: string;

  priorita: 'Bassa' | 'Media' | 'Alta';

  // --- I 3 NUOVI STATI ESATTI DEL DATABASE ---
  stato_admin: 
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

  // Variabile di comodo che usavi per stampare a schermo l'orario (la lasciamo intatta)
  dataOra?: string;

  // --- DATI DEL CLIENTE (utili all'admin/dipendente) ---
  cliente?: string;

  emailCliente?: string;

  telefonoCliente?: string;

  // --- LE NUOVE DATE DEL DATABASE ---
  data_richiesta?: string;

  data_proposta_cliente?: string; // Sostituisce la vecchia dataPreferita

  data_proposta_admin?: string;

  data_accettata?: string;

  // --- TABELLA PONTE DIPENDENTI ---
  // Sostituisce dipendenteAssegnato: ora è un array perché possono essere multipli
  dipendentiAssegnati?: string[];

  // La colonna "note" è stata rimossa, quindi sparisce anche da qui!
}