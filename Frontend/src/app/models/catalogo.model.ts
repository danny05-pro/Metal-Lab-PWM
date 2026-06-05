export type CatalogoCategoria =
  | 'Prodotto'
  | 'Servizio';

export interface CatalogoItem {
  id: number;
  nome: string;
  categoria: CatalogoCategoria;
  prezzo_base: string;
  immagine: string | null;
}

export interface CatalogoRequest {
  nome: string;
  categoria: CatalogoCategoria;
  prezzoBase?: string;
  immagine?: string | null;
}

export interface CatalogoCreateResponse {
  id: number;
  nome: string;
  categoria: CatalogoCategoria;
  prezzoBase?: string;
  immagine: string;
}

export interface CatalogoMessageResponse {
  message: string;
}

export interface CatalogoPreferito {
  user_id: number;
  catalogo_id: number;
}
