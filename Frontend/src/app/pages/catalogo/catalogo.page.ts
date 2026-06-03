import { Component, OnInit } from '@angular/core';
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
import { CatalogoService } from '../../services/catalogo.service';


@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.page.html',
  styleUrls: ['./catalogo.page.scss'],
  standalone: true,
  imports: [
    RouterLink,
    IonHeader, IonToolbar, IonTitle, IonContent, IonButton,
    IonButtons, IonSegment, IonSegmentButton, IonLabel, IonIcon,
    ProductCardComponent, ServiceCardComponent
  ]
})
export class CatalogoPage implements OnInit { // <-- Aggiunto implements OnInit

  selectedSection: 'prodotti' | 'servizi' | 'preferiti' = 'prodotti';
  prodotti: Product[] = [];
  servizi: Service[] = [];

  // Iniettiamo il service nel costruttore
  constructor(private catalogoService: CatalogoService) {
    addIcons({
      heart, heartOutline, arrowBackOutline
    });
  }

  // Scatta appena apriamo la pagina
  ngOnInit() {
    this.caricaCatalogoReale();
  }

  caricaCatalogoReale() {
    this.catalogoService.getCatalogo().subscribe({
      next: (datiDB) => {
        this.prodotti = [];
        this.servizi = [];

        const placeholder = 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=1200&auto=format&fit=crop';

        datiDB.forEach(voce => {
          // AGGIUNGIAMO L'INDIRIZZO DEL SERVER (http://localhost:3000)
          const immagineReale = voce.immagine ? 'http://localhost:3000' + voce.immagine : placeholder;

          if (voce.categoria === 'Prodotto') {
            this.prodotti.push({
              id: voce.id,
              nome: voce.nome,
              categoria: voce.categoria,
              descrizione: 'Prodotto in catalogo.',
              materiale: '-', 
              prezzo: 0, 
              prezzoBase: voce.prezzo_base, 
              immagine: immagineReale, // Ora ha l'URL completo!
              preferito: false
            });
          } else {
            this.servizi.push({
              id: voce.id,
              nome: voce.nome,
              categoria: voce.categoria,
              descrizione: 'Servizio professionale.',
              stato: 'Disponibile',
              prezzoBase: voce.prezzo_base,
              immagine: immagineReale, // Ora ha l'URL completo!
              preferito: false
            });
          }
        });
      },
      error: (err) => console.error('Errore nel caricamento del catalogo:', err)
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
    return this.prodotti.filter(p => p.preferito);
  }

  get serviziPreferiti(): Service[] {
    return this.servizi.filter(s => s.preferito);
  }
}