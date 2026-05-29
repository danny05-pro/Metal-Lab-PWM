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

interface AppuntamentoCalendario {
  id: number;
  dataFormattata: string;
  descrizione: string;
  tipo: 'Intervento' | 'Ordine';
  dettaglio: string;
}

import { Intervento } from 'src/app/models/intervento.model';

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

  appuntamentiCalendario: AppuntamentoCalendario[] = [
    {
      id: 1,
      dataFormattata: '2026-05-20 - 09:00',
      descrizione: 'Riparazione impianto idraulico',
      tipo: 'Intervento',
      dettaglio: 'Stabilimento Napoli'
    }
  ];

  interventiAttivi: Intervento[] = [{
    id: 1,
    cliente: 'Mario Rossi',
    emailCliente: 'mario.rossi@email.it',
    telefonoCliente: '+39 333 1234567',
    descrizione: 'Riparazione impianto industriale',
    luogo: 'Stabilimento Napoli',
    priorita: 'Alta',
    stato: 'Assegnato',
    dataOra: '2026-05-25 09:30',
    dataRichiesta: '2026-05-20',
    dataPreferita: '2026-05-25',
    dipendenteAssegnato: 'Luigi Ferri',
    note: 'Il cliente segnala un blocco improvviso dell’impianto durante il ciclo produttivo.'
  },
{
    id: 2,
    cliente: 'Tech S.p.A.',
    emailCliente: 'ufficio.tecnico@techspa.it',
    telefonoCliente: '+39 081 445566',
    descrizione: 'Manutenzione pressa idraulica',
    luogo: 'Officina Bologna',
    priorita: 'Media',
    stato: 'Programmato',
    dataOra: '2026-05-27 14:00',
    dataRichiesta: '2026-05-21',
    dataPreferita: '2026-05-27',
    dipendenteAssegnato: 'Luigi Ferri',
    note: 'Controllo perdite olio e verifica pressione di esercizio.'
  }];

  storicoInterventi: Storico[] = [
    {
      id: 101,
      descrizione: 'Saldatura struttura portante',
      stato: 'Terminato',
      dataCompletamento: '2026-04-10'
    }
  ];

  constructor() {
    addIcons({
      arrowBackOutline,
      caretDownOutline
    });
  }

  ngOnInit() {}

  cambiaStatoIntervento(
  intervento: Intervento,
  event: CustomEvent
) {

  const nuovoStato = event.detail.value as Intervento['stato'];

  intervento.stato = nuovoStato;

  if (nuovoStato === 'Programmato') {
    intervento.dataOra = '2026-05-30 - 09:00';
  }

  if (nuovoStato === 'Richiesto') {
    intervento.dataOra = 'Da fissare';
  }

  if (nuovoStato === 'Terminato') {
    this.interventiAttivi = this.interventiAttivi.filter(
      item => item.id !== intervento.id
    );

    this.storicoInterventi.push({
  ...intervento,
  dataCompletamento: new Date().toLocaleDateString('it-IT')
});
  }

}

testoPrioritaData(intervento: Intervento): string {

  if (intervento.stato === 'Richiesto') {
    return `Da fissare - Priorità: ${intervento.priorita}`;
  }

  return `${intervento.dataOra} - Priorità: ${intervento.priorita}`;

}
}

