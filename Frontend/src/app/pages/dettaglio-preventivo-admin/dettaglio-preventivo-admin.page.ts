import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

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

import { arrowBackOutline } from 'ionicons/icons';

@Component({
  selector: 'app-dettaglio-preventivo-admin',
  templateUrl: './dettaglio-preventivo-admin.page.html',
  styleUrls: ['./dettaglio-preventivo-admin.page.scss'],
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
export class DettaglioPreventivoAdminPage {

  preventivoId = '';

  preventivo = {
    id: 1,
    cliente: 'Mario Rossi',
    emailCliente: 'mario.rossi@email.it',
    descrizione: 'Realizzazione struttura metallica industriale per area produttiva.',
    servizio: 'Carpenteria metallica',
    materiale: 'Acciaio zincato',
    dimensioni: '3x2m',
    finitura: 'Zincatura',
    allegato: 'disegno-struttura.pdf',
    dataRichiesta: '2026-05-18',
    stato: 'In attesa',
    prezzoProposto: null as number | null
  };

  constructor(private route: ActivatedRoute, private router: Router, private alertController: AlertController) {
    addIcons({
      arrowBackOutline
    });

    this.preventivoId = this.route.snapshot.paramMap.get('id') || '';
  }

  rifiutaPreventivo() {
    this.preventivo.stato = 'Rifiutato';
    this.preventivo.prezzoProposto = null;

    setTimeout(() => {
      this.router.navigate(['/dashboard-admin']);
    }, 5);
  }

  async proponiPrezzo() {

  const alert = await this.alertController.create({
    header: 'Proponi prezzo',
    message: 'Inserisci il prezzo da proporre al cliente.',
    cssClass: 'custom-dark-alert',

    inputs: [
      {
        name: 'prezzo',
        type: 'number',
        placeholder: 'Es. 250',
        cssClass: 'dark-alert-input',
        attributes: {
          min: '1'
        }
      }
    ],

    buttons: [
      {
        text: 'Annulla',
        role: 'cancel',
        cssClass: 'dark-alert-btn-cancel'
      },
      {
        text: 'Conferma',
        cssClass: 'dark-alert-btn-confirm',
        handler: (data: any) => {

          const prezzo = Number(data.prezzo);

          if (isNaN(prezzo) || prezzo <= 0) {
            return false;
          }

          this.preventivo.prezzoProposto = prezzo;
          this.preventivo.stato = 'Prezzo proposto';

          this.router.navigate(['/dashboard-admin']);

          return true;

        }
      }
    ]
  });

  await alert.present();

}
}