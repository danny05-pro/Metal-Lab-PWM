export interface Service {
  id: number;
  nome: string;
  descrizione: string;
  categoria: string;
  stato: string;
  prezzoBase?: string; // <-- AGGIUNTO
  immagine: string;
  preferito: boolean;
}