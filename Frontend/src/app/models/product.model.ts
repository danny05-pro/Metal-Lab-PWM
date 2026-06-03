export interface Product {
  id: number;
  nome: string;
  descrizione: string;
  categoria: string;
  materiale: string;
  prezzo: number;
  prezzoBase?: string; // <-- AGGIUNTO
  immagine: string;
  preferito: boolean;
}