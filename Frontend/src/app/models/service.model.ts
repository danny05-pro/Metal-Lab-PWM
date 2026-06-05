import { CatalogoItem } from './catalogo.model';

export interface Service extends CatalogoItem {
  categoria: 'Servizio';
  preferito: boolean;
}
