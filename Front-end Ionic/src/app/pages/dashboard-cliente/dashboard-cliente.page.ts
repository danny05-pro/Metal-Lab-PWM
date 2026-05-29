import { Component } from '@angular/core';
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

import {
  arrowBackOutline
} from 'ionicons/icons';

import { Preventivo } from 'src/app/models/preventivo.model';
import { Intervento } from 'src/app/models/intervento.model';
import { Ordine } from 'src/app/models/ordine.model';

@Component({
  selector: 'app-dashboard-cliente',
  templateUrl: './dashboard-cliente.page.html',
  styleUrls: ['./dashboard-cliente.page.scss'],
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
export class DashboardClientePage {

  preventivi: Preventivo[] = [
    {
      id: 1,
      descrizione: 'Struttura metallica industriale',
      servizio: 'Saldatura',
      materiale: 'Acciaio',
      dimensioni: '3x2m', 
      finitura: 'Zincatura',
      stato: 'In lavorazione',
      dataRichiesta: '2026-05-10'
    },
    {
      id: 2,
      descrizione: 'Cancello automatico',
      servizio: 'Taglio laser',
      materiale: 'Alluminio',
      dimensioni: '2x1m',
      finitura: 'Verniciatura',
      stato: 'Completato',
      dataRichiesta: '2026-05-01'
    }
  ];

  interventi: Intervento[] = [
    {
      id: 1,
      descrizione: 'Riparazione impianto',
      luogo: 'Stabilimento Napoli',
      priorita: 'Alta', // Priorità valida
      stato: 'Programmato', // Stato valido
      dataOra: '2026-05-20'
    },
    {
      id: 2,
      descrizione: 'Manutenzione straordinaria pressa idraulica',
      luogo: 'Officina Bologna',
      priorita: 'Media', // Priorità valida
      stato: 'Terminato', // Corretto da "In corso" a "Terminato"
      dataOra: '2026-05-22'
    }
  ];

  ordini: Ordine[] = [
    {
      id: 1,
      descrizione: 'Ordine profilati metallici',
      stato: 'Pronto per il ritiro', // Stato valido
      dataConsegnaPrevista: '2026-05-25'
    },
    {
      id: 2,
      descrizione: 'Bulloneria speciale ad alta resistenza',
      stato: 'In lavorazione', // Corretto da "In spedizione" a "In lavorazione"
      dataConsegnaPrevista: '2026-05-28'
    }
  ];

constructor() {
    addIcons({
      arrowBackOutline
    });
  }

  storicoOrdini: Ordine[] = [
    {
      id: 101,
      descrizione: 'Fornitura staffe di giunzione V1',
      stato: 'Consegnato', // Stato valido
      dataConsegnaPrevista: '2026-04-14'
    },
    {
      id: 102,
      descrizione: 'Piastre preforate su misura',
      stato: 'Consegnato', // Stato valido
      dataConsegnaPrevista: '2026-03-28'
    }
  ];

  motivoIntervento(descrizione: string): string {
    return descrizione || 'Intervento Tecnico';
  }
  eventiCalendario = [
  {
    id: 1,
    titolo: 'Intervento programmato',
    tipo: 'Intervento',
    data: '2026-05-20',
    descrizione: 'Riparazione impianto - Stabilimento Napoli'
  },
  {
    id: 2,
    titolo: 'Ritiro ordine',
    tipo: 'Ordine',
    data: '2026-05-25',
    descrizione: 'Ordine profilati metallici pronto per il ritiro'
  },
  {
    id: 3,
    titolo: 'Consegna prevista',
    tipo: 'Ordine',
    data: '2026-05-28',
    descrizione: 'Bulloneria speciale ad alta resistenza'
  }
];
}