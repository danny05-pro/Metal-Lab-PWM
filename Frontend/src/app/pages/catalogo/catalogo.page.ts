import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular'; // <--- Importante per gli avvisi

import {
  IonContent, IonSegment, IonSegmentButton, IonLabel
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { heart, heartOutline, arrowBackOutline } from 'ionicons/icons';

import { Product } from '../../models/product.model';
import { Service } from '../../models/service.model';
import { CatalogoItem } from '../../models/catalogo.model';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { ServiceCardComponent } from '../../components/service-card/service-card.component';
import { CatalogoService } from '../../services/catalogo.service';
import { HeaderComponent } from '../../components/header/header.component';

@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.page.html',
  styleUrls: ['./catalogo.page.scss'],
  standalone: true,
  imports: [
    HeaderComponent,
    IonContent, IonSegment, IonSegmentButton, IonLabel,
    ProductCardComponent, ServiceCardComponent
  ]
})
export class CatalogoPage implements OnInit {

  selectedSection: 'prodotti' | 'servizi' | 'preferiti' = 'prodotti';
  prodotti: Product[] = [];
  servizi: Service[] = [];

  constructor(
    private catalogoService: CatalogoService,
    private alertController: AlertController // <--- Iniettato
  ) {
    addIcons({ heart, heartOutline, arrowBackOutline });
  }

  ngOnInit() {
    this.caricaCatalogoReale();
  }

  caricaCatalogoReale() {
    const token = sessionStorage.getItem('token');

    this.catalogoService.getCatalogo().subscribe({
      next: (datiDB) => {
        if (token) {
          // Se è loggato, incrocia i dati del catalogo con l'array dei suoi preferiti
          this.catalogoService.getPreferiti().subscribe({
            next: (preferitiIds) => this.smistaDati(datiDB, preferitiIds),
            error: () => this.smistaDati(datiDB, [])
          });
        } else {
          // Utente non loggato, niente preferiti
          this.smistaDati(datiDB, []);
        }
      },
      error: (err) => console.error('Errore caricamento catalogo:', err)
    });
  }

  // Helper per dividere i dati e assegnare lo stato "preferito"
  smistaDati(datiDB: CatalogoItem[], preferitiIds: number[]) {
    this.prodotti = [];
    this.servizi = [];
    const placeholder = 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=1200&auto=format&fit=crop';

    datiDB.forEach(voce => {
      const immagineReale = voce.immagine ? (voce.immagine.startsWith('http') ? voce.immagine : 'http://localhost:3000' + voce.immagine) : placeholder;
      const isPreferito = preferitiIds.includes(voce.id); // Controlla se l'ID è nel DB

      if (voce.categoria === 'Prodotto') {
        this.prodotti.push({
          id: voce.id,
          nome: voce.nome,
          categoria: voce.categoria,
          prezzo_base: voce.prezzo_base,
          immagine: immagineReale,
          preferito: isPreferito
        });
      } else {
        this.servizi.push({
          id: voce.id,
          nome: voce.nome,
          categoria: voce.categoria,
          prezzo_base: voce.prezzo_base,
          immagine: immagineReale,
          preferito: isPreferito
        });
      }
    });
  }

  cambiaSezione(event: CustomEvent) {
    this.selectedSection = event.detail.value;
  }

  // Avviso se non si è loggati
  async controllaLogin(): Promise<boolean> {
    if (!sessionStorage.getItem('token')) {
      const alert = await this.alertController.create({
        header: 'Accesso Richiesto',
        message: 'Devi accedere al tuo account per salvare i preferiti.',
        cssClass: 'custom-dark-alert',
        buttons: ['OK']
      });
      await alert.present();
      return false;
    }
    return true;
  }

  async toggleProdottoPreferito(prodotto: Product) {
    if (!(await this.controllaLogin())) return;

    if (prodotto.preferito) {
      this.catalogoService.rimuoviPreferito(prodotto.id).subscribe(() => prodotto.preferito = false);
    } else {
      this.catalogoService.aggiungiPreferito(prodotto.id).subscribe(() => prodotto.preferito = true);
    }
  }

  async toggleServizioPreferito(servizio: Service) {
    if (!(await this.controllaLogin())) return;

    if (servizio.preferito) {
      this.catalogoService.rimuoviPreferito(servizio.id).subscribe(() => servizio.preferito = false);
    } else {
      this.catalogoService.aggiungiPreferito(servizio.id).subscribe(() => servizio.preferito = true);
    }
  }

  get prodottiPreferiti(): Product[] { return this.prodotti.filter(p => p.preferito); }
  get serviziPreferiti(): Service[] { return this.servizi.filter(s => s.preferito); }
}
