import { Component } from '@angular/core';

import {
  ActivatedRoute,
  Router,
  RouterLink
} from '@angular/router';
import { AlertController } from '@ionic/angular';
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

import { Intervento } from 'src/app/models/intervento.model';

@Component({
  selector: 'app-dettaglio-intervento-dipendente',
  templateUrl: './dettaglio-intervento-dipendente.page.html',
  styleUrls: ['./dettaglio-intervento-dipendente.page.scss'],
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
export class DettaglioInterventoDipendentePage {

  interventoId = '';

  intervento: Intervento = {
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
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
      private alertController: AlertController
  ) {

    addIcons({
      arrowBackOutline
    });

    this.interventoId =
      this.route.snapshot.paramMap.get('id') || '';

  }

  get statoAggiornabile(): boolean {

    return (
      this.intervento.stato === 'Assegnato' ||
      this.intervento.stato === 'Programmato'
    );

  }

async modificaStatoIntervento() {

  const alert = await this.alertController.create({
    header: 'Modifica stato intervento',
    message: 'Seleziona il nuovo stato dell’intervento.',
    cssClass: 'custom-dark-alert',
    inputs: [
      {
        type: 'radio',
        label: 'Assegnato',
        value: 'Assegnato',
        checked: this.intervento.stato === 'Assegnato'
      },
      {
        type: 'radio',
        label: 'Programmato',
        value: 'Programmato',
        checked: this.intervento.stato === 'Programmato'
      },
      {
        type: 'radio',
        label: 'Terminato',
        value: 'Terminato',
        checked: this.intervento.stato === 'Terminato'
      }
    ],
    buttons: [
      {
        text: 'Annulla',
        role: 'cancel'
      },
      {
        text: 'Conferma',
        handler: (nuovoStato: Intervento['stato']) => {

          if (!nuovoStato) {
            return false;
          }

          this.intervento.stato = nuovoStato;

          if (nuovoStato === 'Terminato') {
            this.intervento.dataOra =
              new Date().toLocaleDateString('it-IT');
          }

          this.router.navigate([
            '/dashboard-dipendente'
          ]);

          return true;

        }
      }
    ]
  });

  await alert.present();

}

}
