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
import { arrowBackOutline } from 'ionicons/icons';

import { Preventivo } from 'src/app/models/preventivo.model';
import { Ordine } from 'src/app/models/ordine.model';
import { InterventiService } from '../../services/interventi.service';

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

  // --- VARIABILI COLLEGATE AL DATABASE (REALI) ---
  tuttiGliInterventi: any[] = [];
  interventiFuturi: any[] = [];

  // --- VARIABILI MOCKATE ---
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

  ordini: Ordine[] = [
    {
      id: 1,
      descrizione: 'Ordine profilati metallici',
      stato: 'Pronto per il ritiro', 
      dataConsegnaPrevista: '2026-05-25'
    },
    {
      id: 2,
      descrizione: 'Bulloneria speciale ad alta resistenza',
      stato: 'In lavorazione', 
      dataConsegnaPrevista: '2026-05-28'
    }
  ];

  storicoOrdini: Ordine[] = [
    {
      id: 101,
      descrizione: 'Fornitura staffe di giunzione V1',
      stato: 'Consegnato', 
      dataConsegnaPrevista: '2026-04-14'
    },
    {
      id: 102,
      descrizione: 'Piastre preforate su misura',
      stato: 'Consegnato', 
      dataConsegnaPrevista: '2026-03-28'
    }
  ];

  constructor(private interventiService: InterventiService) {
    addIcons({ arrowBackOutline });
  }

  // Scatta automaticamente ogni volta che entri in questa pagina
  ionViewWillEnter() {
    this.caricaInterventi();
  }

  caricaInterventi() {
    this.interventiService.getInterventiCliente().subscribe({
      next: (dati) => {
        this.tuttiGliInterventi = dati;

        const oggi = new Date();
        oggi.setHours(0, 0, 0, 0);

        this.interventiFuturi = dati.filter(intervento => {
          if (!intervento.data_intervento) return false; 
          const dataIntervento = new Date(intervento.data_intervento);
          return dataIntervento >= oggi;
        });
      },
      error: (err) => console.error('Errore caricamento interventi', err)
    });
  }
}