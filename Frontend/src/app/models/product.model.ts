import { CatalogoItem } from './catalogo.model';

export interface Product extends CatalogoItem {
  categoria: 'Prodotto';
  preferito: boolean;
}
