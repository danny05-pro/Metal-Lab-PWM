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
// IMPORTA IL SERVICE DEI PREVENTIVI
import { PreventiviService } from '../../services/preventivi.service';

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

  tuttiGliInterventi: any[] = [];
  interventiFuturi: any[] = [];
  
  // ARRAY VUOTO (popolato dal DB)
  preventivi: Preventivo[] = [];

  // Manteniamo questi mock solo per non rompere l'UI attuale
  ordini: Ordine[] = []; 
  storicoOrdini: Ordine[] = [];

  constructor(
    private interventiService: InterventiService,
    private preventiviService: PreventiviService // INIETTA IL SERVICE
  ) {
    addIcons({ arrowBackOutline });
  }

  ionViewWillEnter() {
    this.caricaInterventi();
    this.caricaPreventivi(); // CHIAMA IL CARICAMENTO DATI REALI
  }

  caricaInterventi() {
    this.interventiService.getInterventiCliente().subscribe({
      next: (dati) => {
        this.tuttiGliInterventi = dati;
        const oggi = new Date();
        oggi.setHours(0, 0, 0, 0);
        this.interventiFuturi = dati.filter(intervento => {
          const dataDaUsare = intervento.data_accettata || intervento.data_proposta_admin || intervento.data_proposta_cliente || intervento.data_richiesta;
          if (!dataDaUsare) return false;
          return new Date(dataDaUsare) >= oggi;
        });
      },
      error: (err) => console.error('Errore caricamento interventi', err)
    });
  }

  // NUOVA FUNZIONE PER CARICARE I PREVENTIVI DAL DB
  caricaPreventivi() {
    this.preventiviService.getPreventivi().subscribe({
      next: (dati) => {
        this.preventivi = dati;
      },
      error: (err) => {
        console.error('Errore caricamento preventivi:', err);
      }
    });
  }
}