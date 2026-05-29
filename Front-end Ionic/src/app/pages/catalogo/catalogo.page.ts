import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonButtons,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonIcon
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';

import {
  heart,
  heartOutline,
  arrowBackOutline
} from 'ionicons/icons';

import { Product } from '../../models/product.model';
import { Service } from '../../models/service.model';

import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { ServiceCardComponent } from '../../components/service-card/service-card.component';

@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.page.html',
  styleUrls: ['./catalogo.page.scss'],
  standalone: true,
  imports: [
    RouterLink,

    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonButtons,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonIcon,

    ProductCardComponent,
    ServiceCardComponent
  ]
})
export class CatalogoPage {

  selectedSection: 'prodotti' | 'servizi' | 'preferiti' = 'prodotti';

  prodotti: Product[] = [
    {
      id: 1,
      nome: 'Staffa di fissaggio',
      descrizione: 'Staffa metallica resistente per installazioni industriali.',
      categoria: 'Componenti metallici',
      materiale: 'Acciaio zincato',
      prezzo: 18.50,
      immagine: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=1200&auto=format&fit=crop',
      preferito: false
    },

    {
      id: 2,
      nome: 'Piastra preforata',
      descrizione: 'Piastra in ferro con fori standard per montaggio rapido.',
      categoria: 'Piastre',
      materiale: 'Ferro',
      prezzo: 32,
      immagine: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?q=80&w=1200&auto=format&fit=crop',
      preferito: false
    }
  ];

  servizi: Service[] = [
    {
      id: 1,
      nome: 'Carpenteria metallica',
      descrizione: 'Realizzazione di strutture in ferro, acciaio e inox su misura.',
      categoria: 'Lavorazioni',
      stato: 'Disponibile',
      immagine: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1200&auto=format&fit=crop',
      preferito: false
    },

    {
      id: 2,
      nome: 'Manutenzione industriale',
      descrizione: 'Interventi tecnici programmati o urgenti su impianti industriali.',
      categoria: 'Manutenzione',
      stato: 'Disponibile',
      immagine: 'https://images.unsplash.com/photo-1535813547-99c456a41d4a?q=80&w=1200&auto=format&fit=crop',
      preferito: false
    }
  ];

  constructor() {
    addIcons({
      heart,
      heartOutline,
      arrowBackOutline
    });
  }

  cambiaSezione(event: CustomEvent) {
    this.selectedSection = event.detail.value;
  }

  toggleProdottoPreferito(prodotto: Product) {
    prodotto.preferito = !prodotto.preferito;
  }

  toggleServizioPreferito(servizio: Service) {
    servizio.preferito = !servizio.preferito;
  }

  get prodottiPreferiti(): Product[] {
    return this.prodotti.filter(
      prodotto => prodotto.preferito
    );
  }

  get serviziPreferiti(): Service[] {
    return this.servizi.filter(
      servizio => servizio.preferito
    );
  }

}