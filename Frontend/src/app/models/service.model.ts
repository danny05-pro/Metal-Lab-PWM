export interface Service {
  id: number;
  nome: string;
  descrizione: string;
  categoria: 'Servizio';
  stato: string;
  prezzo_base?: string;
  prezzoBase?: string;
  immagine?: string;
  preferito: boolean;
}
