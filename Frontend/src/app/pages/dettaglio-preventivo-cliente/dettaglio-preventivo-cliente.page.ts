import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonChip
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';

import {
  arrowBackOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-dettaglio-preventivo-cliente',
  templateUrl: './dettaglio-preventivo-cliente.page.html',
  styleUrls: ['./dettaglio-preventivo-cliente.page.scss'],
  standalone: true,
  imports: [
    RouterLink,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonButton,
    IonIcon,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonChip
  ]
})
export class DettaglioPreventivoClientePage {

  preventivoId = '';

  preventivo = {
    id: 1,
    descrizione: 'Struttura metallica industriale',
    servizio: 'Carpenteria metallica',
    materiale: 'Acciaio zincato',
    dimensioni: '3x2m',
    finitura: 'Zincatura',
    allegato: 'disegno-struttura.pdf',
    dataRichiesta: '2026-05-10',
    stato: 'In lavorazione',
    prezzoProposto: 850
  };

  constructor(private route: ActivatedRoute, private router: Router) {

    addIcons({
      arrowBackOutline
    });

    this.preventivoId =
      this.route.snapshot.paramMap.get('id') || '';

  }

  accettaPreventivo() {
    this.preventivo.stato = 'Accettato dal cliente';
    setTimeout(() => {
      this.router.navigate(['/dashboard-cliente']);
    }, 5);
  }

  rifiutaPreventivo() {
    this.preventivo.stato = 'Rifiutato dal cliente';
    setTimeout(() => {
      this.router.navigate(['/dashboard-cliente']);
    }, 5);
  }

}
