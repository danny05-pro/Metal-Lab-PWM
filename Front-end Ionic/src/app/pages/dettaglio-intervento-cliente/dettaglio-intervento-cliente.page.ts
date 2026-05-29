import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

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
  selector: 'app-dettaglio-intervento-cliente',
  templateUrl: './dettaglio-intervento-cliente.page.html',
  styleUrls: ['./dettaglio-intervento-cliente.page.scss'],
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
export class DettaglioInterventoClientePage {

  interventoId = '';

  intervento = {
    id: 1,
    descrizione: 'Riparazione impianto',
    luogo: 'Stabilimento Napoli',
    priorita: 'Alta',
    stato: 'Programmato',
    dataOra: '2026-05-20',
    tecnicoAssegnato: 'Luigi Ferri',
    note: 'Intervento programmato per verifica e riparazione dell’impianto industriale.'
  };

  constructor(private route: ActivatedRoute) {

    addIcons({
      arrowBackOutline
    });

    this.interventoId =
      this.route.snapshot.paramMap.get('id') || '';

  }

}