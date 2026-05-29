import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink, Router} from '@angular/router';

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

import { AlertController } from '@ionic/angular';

import { addIcons } from 'ionicons';

import {
  arrowBackOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-dettaglio-intervento-admin',
  templateUrl: './dettaglio-intervento-admin.page.html',
  styleUrls: ['./dettaglio-intervento-admin.page.scss'],
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
export class DettaglioInterventoAdminPage {

  interventoId = '';

  intervento = {
    id: 1,
    cliente: 'Mario Rossi',
    emailCliente: 'mario.rossi@email.it',
    telefonoCliente: '+39 333 1234567',
    descrizione: 'Riparazione impianto industriale',
    luogo: 'Stabilimento Napoli',
    priorita: 'Alta',
    stato: 'Da assegnare',
    dataRichiesta: '2026-05-20',
    dataPreferita: '2026-05-25',
    dipendenteAssegnato: null as string | null,
    note: 'Il cliente segnala un blocco improvviso dell’impianto durante il ciclo produttivo.'
  };

  dipendentiDisponibili = [
    'Luigi Ferri',
    'Marco Bianchi',
    'Antonio Russo',
    'Giuseppe Romano'
  ];

  constructor(
      private router: Router,
    private route: ActivatedRoute,
    private alertController: AlertController
  ) {

    addIcons({
      arrowBackOutline
    });

    this.interventoId =
      this.route.snapshot.paramMap.get('id') || '';

  }

  async assegnaDipendente() {
    const alert = await this.alertController.create({
      header: 'Assegna dipendente',
      message: 'Seleziona il dipendente da assegnare a questo intervento.',
      cssClass: 'custom-dark-alert',
      inputs: this.dipendentiDisponibili.map(dipendente => ({
        type: 'radio',
        label: dipendente,
        value: dipendente
      })),
      buttons: [
        {
          text: 'Annulla',
          role: 'cancel',
          cssClass: 'dark-alert-btn-cancel' // <--- Aggiunto stile Grigio
        },
        {
          text: 'Conferma',
          cssClass: 'dark-alert-btn-confirm', // <--- Aggiunto stile Ambra
          handler: (dipendenteSelezionato: string) => {
            if (!dipendenteSelezionato) {
              return false;
            }

            this.intervento.dipendenteAssegnato = dipendenteSelezionato;
            this.intervento.stato = 'Assegnato';
            this.router.navigate(['/dashboard-admin']);

            return true;
          }
        }
      ]
    });

    await alert.present();
  }

}