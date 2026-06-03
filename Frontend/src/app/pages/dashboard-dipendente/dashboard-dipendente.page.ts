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
import { arrowBackOutline, caretDownOutline } from 'ionicons/icons';
import { Intervento } from 'src/app/models/intervento.model';
import { InterventiService } from 'src/app/services/interventi.service';

interface AppuntamentoCalendario {
  id: number;
  dataFormattata: string;
  descrizione: string;
  tipo: 'Intervento';
  luogo: string;
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
export class DashboardDipendentePage {

  // Array inizializzati vuoti: i dati arriveranno dal backend
  appuntamentiCalendario: AppuntamentoCalendario[] = [];
  interventiAttivi: Intervento[] = [];
  storicoInterventi: Storico[] = [];

  constructor( private interventiService: InterventiService) {
    addIcons({
      arrowBackOutline,
      caretDownOutline
    });
  }

 ionViewWillEnter() {
  this.caricaInterventiAssegnati();
}

  testoPrioritaData(intervento: Intervento): string {
    if (intervento.stato_lavorazione === 'Da programmare') {
      return `Da fissare - Priorità: ${intervento.priorita}`;
    }
    return `${intervento.data_accettata || intervento.data_proposta_admin || 'Da programmare'} - Priorità: ${intervento.priorita}`;
  }


caricaInterventiAssegnati() {
  this.interventiService.getInterventiDipendente().subscribe({
    next: (interventi) => {
      this.interventiAttivi = interventi.filter(
        intervento => intervento.stato_lavorazione !== 'Terminato'
      );

      this.storicoInterventi = interventi
        .filter(intervento => intervento.stato_lavorazione === 'Terminato')
        .map(intervento => ({
          id: intervento.id,
          descrizione: intervento.descrizione,
          stato: intervento.stato_lavorazione,
          dataCompletamento: intervento.data_accettata || 'Non disponibile'
        }));

      this.appuntamentiCalendario = interventi
        .filter(intervento => intervento.stato_lavorazione !== 'Terminato')
        .map(intervento => ({
          id: intervento.id,
          dataFormattata:
            intervento.data_accettata ||
            intervento.data_proposta_admin ||
            'Da programmare',
          descrizione: intervento.descrizione,
          tipo: 'Intervento' as const,
          luogo: intervento.luogo
        }));
    },
    error: (err) => {
      console.error('Errore caricamento interventi dipendente:', err);
    }
  });
}


}