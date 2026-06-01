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
import { arrowBackOutline } from 'ionicons/icons';

import { Preventivo } from 'src/app/models/preventivo.model';
import { Ordine } from 'src/app/models/ordine.model';

// IMPORTIAMO IL SERVICE DEGLI INTERVENTI
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
export class DashboardClientePage implements OnInit {

  // --- VARIABILI COLLEGATE AL DATABASE (REALI) ---
  tuttiGliInterventi: any[] = [];
  interventiFuturi: any[] = [];

  // --- VARIABILI MOCKATE (Per mantenere l'UI funzionante) ---
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

  // INIETTIAMO IL SERVICE NEL COSTRUTTORE
  constructor(private interventiService: InterventiService) {
    addIcons({
      arrowBackOutline
    });
  }

  // SCATTA AUTOMATICAMENTE ALL'APERTURA DELLA PAGINA
  ngOnInit() {
    this.caricaInterventi();
  }

  // FUNZIONE PER SCARICARE I DATI E DIVIDERLI
  caricaInterventi() {
    this.interventiService.getInterventiCliente().subscribe({
      next: (dati) => {
        // 1. Popoliamo la lista totale degli interventi
        this.tuttiGliInterventi = dati;

        // 2. Filtriamo solo gli interventi con una data programmata nel futuro (per il calendario)
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

  motivoIntervento(descrizione: string): string {
    return descrizione || 'Intervento Tecnico';
  }
}