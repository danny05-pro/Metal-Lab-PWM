export interface Product {
  id: number;
  nome: string;
  descrizione: string;
  categoria: 'Prodotto';
  materiale: string;
  prezzo: number;
  prezzo_base?: string;
  prezzoBase?: string;
  immagine?: string;
  preferito: boolean;
}
