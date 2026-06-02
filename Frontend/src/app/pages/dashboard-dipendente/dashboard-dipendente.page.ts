import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonGrid,
  IonRow,
  IonCol,
  IonChip,
  IonButton,
  IonButtons,
  IonIcon
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import { arrowBackOutline, caretDownOutline } from 'ionicons/icons';
import { Intervento } from 'src/app/models/intervento.model';

interface AppuntamentoCalendario {
  id: number;
  dataFormattata: string;
  descrizione: string;
  tipo: 'Intervento' | 'Ordine';
  dettaglio: string;
}

interface Storico {
  id: number;
  descrizione: string;
  stato: string;
  dataCompletamento: string;
}

@Component({
  selector: 'app-dashboard-dipendente',
  templateUrl: './dashboard-dipendente.page.html',
  styleUrls: ['./dashboard-dipendente.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonGrid,
    IonRow,
    IonCol,
    IonChip,
    IonButton,
    IonButtons,
    IonIcon
  ]
})
export class DashboardDipendentePage implements OnInit {

  // Array inizializzati vuoti: i dati arriveranno dal backend
  appuntamentiCalendario: AppuntamentoCalendario[] = [];
  interventiAttivi: Intervento[] = [];
  storicoInterventi: Storico[] = [];

  constructor() {
    addIcons({
      arrowBackOutline,
      caretDownOutline
    });
  }

  ngOnInit() {
    // TODO: Qui dovrai chiamare il tuo servizio per popolare gli array
    // Esempio: this.caricaDati();
  }

  testoPrioritaData(intervento: Intervento): string {
    if (intervento.stato_lavorazione === 'Da programmare') {
      return `Da fissare - Priorità: ${intervento.priorita}`;
    }
    return `${intervento.dataOra} - Priorità: ${intervento.priorita}`;
  }
}