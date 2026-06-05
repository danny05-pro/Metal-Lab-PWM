import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import {
  IonContent, IonCard, IonCardContent,
  IonCardHeader, IonCardTitle, IonGrid, IonRow, IonCol, IonChip,
  IonIcon, IonLabel
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import { 
  caretDownOutline,
  checkmarkDoneOutline, closeCircleOutline, trashOutline, alertCircleOutline, 
  calendarNumberOutline, timeOutline, personAddOutline, calendarOutline, 
  buildOutline, helpCircleOutline
} from 'ionicons/icons';
import { Intervento } from 'src/app/models/intervento.model';
import { InterventiService } from 'src/app/services/interventi.service';
import { HeaderComponent } from 'src/app/components/header/header.component';

interface Storico {
  id: number;
  descrizione: string;
  stato_lavorazione: string;
  stato_admin: string;
  stato_risposta_cliente: string;
  dataCompletamento: string;
  cliente_nome?: string;
  cliente_cognome?: string;
}

@Component({
  selector: 'app-dashboard-dipendente',
  templateUrl: './dashboard-dipendente.page.html',
  styleUrls: ['./dashboard-dipendente.page.scss'],
  standalone: true,
  imports: [
    HeaderComponent,
    CommonModule, RouterLink, IonContent,
    IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonGrid, IonRow,
    IonCol, IonChip, IonIcon, IonLabel
  ]
})
export class DashboardDipendentePage {

  interventiAttivi: Intervento[] = [];
  storicoInterventi: Storico[] = [];
  nomeDipendente = '';

  constructor(private interventiService: InterventiService) {
    addIcons({
      caretDownOutline,
      checkmarkDoneOutline, closeCircleOutline, trashOutline, alertCircleOutline, 
      calendarNumberOutline, timeOutline, personAddOutline, calendarOutline, 
      buildOutline, helpCircleOutline
    });
  }

  ionViewWillEnter() {
    this.caricaInterventiAssegnati();
    this.nomeDipendente = sessionStorage.getItem('nomeUtente') || 'Dipendente';
  }

  caricaInterventiAssegnati() {
    this.interventiService.getInterventiDipendente().subscribe({
      next: (interventi) => {
        
        this.interventiAttivi = interventi
          .filter(intervento => intervento.stato_lavorazione !== 'Terminato')
          .sort((a, b) => {
            const dataA = a.data_accettata || a.data_proposta_admin || a.data_proposta_cliente || a.data_richiesta || '';
            const dataB = b.data_accettata || b.data_proposta_admin || b.data_proposta_cliente || b.data_richiesta || '';
            
            const tempoA = dataA ? new Date(dataA).getTime() : new Date('9999-12-31').getTime();
            const tempoB = dataB ? new Date(dataB).getTime() : new Date('9999-12-31').getTime();
            
            return tempoA - tempoB;
          });

        this.storicoInterventi = interventi
          .filter(intervento => intervento.stato_lavorazione === 'Terminato')
          .map(intervento => ({
            id: intervento.id,
            descrizione: intervento.descrizione,
            stato_lavorazione: intervento.stato_lavorazione,
            stato_admin: intervento.stato_admin,
            stato_risposta_cliente: intervento.stato_risposta_cliente,
            dataCompletamento: intervento.data_accettata || 'Non disponibile',
            cliente_nome: intervento.cliente_nome,
            cliente_cognome: intervento.cliente_cognome
          }));
      },
      error: (err) => {
        console.error('Errore caricamento interventi dipendente:', err);
      }
    });
  }

  getStatoInterventoUX(intervento: any): { label: string, color: string, icon: string } {
    if (intervento.stato_lavorazione === 'Terminato') return { label: 'Completato', color: 'success', icon: 'checkmark-done-outline' };
    if (intervento.stato_admin === 'Rifiutato') return { label: 'Rifiutato', color: 'danger', icon: 'close-circle-outline' };
    if (intervento.stato_risposta_cliente === 'Intervento annullato') return { label: 'Annullato dal Cliente', color: 'danger', icon: 'trash-outline' };

    if (intervento.stato_lavorazione === 'Programmato') return { label: 'Programmato', color: 'primary', icon: 'calendar-outline' };
    if (intervento.stato_lavorazione === 'In lavorazione') return { label: 'In lavorazione', color: 'tertiary', icon: 'build-outline' };

    return { label: intervento.stato_lavorazione, color: 'medium', icon: 'help-circle-outline' };
  }
}
