import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import {
  IonContent,
  IonButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonCard,
  IonCardContent,
  IonDatetime,
  IonModal
} from '@ionic/angular/standalone';

import { AlertController } from '@ionic/angular';

import { addIcons } from 'ionicons';

import {
  arrowBackOutline,
  warningOutline,
  constructOutline,
  calendarOutline
} from 'ionicons/icons';

import {
  InterventiService,
  InterventoRichiesta
} from '../../services/interventi.service';
import { HeaderComponent } from '../../components/header/header.component';

@Component({
  selector: 'app-interventi',
  templateUrl: './interventi.page.html',
  styleUrls: ['./interventi.page.scss'],
  standalone: true,
  imports: [
    HeaderComponent,
    FormsModule,
    IonContent,
    IonButton,
    IonIcon,
    IonItem,
    IonLabel,
    IonInput,
    IonTextarea,
    IonSelect,
    IonSelectOption,
    IonCard,
    IonCardContent,
    IonDatetime,
    IonModal
  ]
})
export class InterventiPage {

  descrizione = '';

  luogo = '';

  priorita: 'Bassa' | 'Media' | 'Alta' | '' = '';

  dataIntervento: string | undefined;

  interventoInviato = false;

  dataMinima: string;

  constructor(
    private router: Router,
    private interventiService: InterventiService,
    private alertController: AlertController
  ) {
    addIcons({
      arrowBackOutline,
      warningOutline,
      constructOutline,
      calendarOutline
    });

    const domani = new Date();
    domani.setDate(domani.getDate() + 1);

    const tzoffset = domani.getTimezoneOffset() * 60000;

    this.dataMinima = new Date(
      domani.getTime() - tzoffset
    ).toISOString().split('T')[0];
  }

  get dataFormattata(): string {
    if (!this.dataIntervento) {
      return '';
    }

    const d = new Date(this.dataIntervento);

    return d.toLocaleDateString('it-IT');
  }

  get formValido(): boolean {
    return (
      this.descrizione.trim() !== '' &&
      this.luogo.trim() !== '' &&
      this.priorita !== ''
    );
  }

  inviaIntervento() {
    if (!this.formValido) {
      return;
    }

    if (
      this.priorita !== 'Bassa' &&
      this.priorita !== 'Media' &&
      this.priorita !== 'Alta'
    ) {
      return;
    }

    const dati: InterventoRichiesta = {
      descrizione: this.descrizione,
      luogo: this.luogo,
      priorita: this.priorita,
      data_proposta_cliente: this.dataIntervento
        ? this.dataIntervento.split('T')[0]
        : undefined
    };

    this.interventiService.creaIntervento(dati).subscribe({
      next: () => {
        this.interventoInviato = true;

        setTimeout(() => {
          this.router.navigate(['/dashboard-cliente']);
        }, 1500);
      },

      error: async (err: any) => {
        console.error('Errore invio richiesta', err);

        const messaggio =
          err.error?.message ||
          'Errore di connessione al server.';

        const alert = await this.alertController.create({
          cssClass: 'custom-dark-alert',
          header: 'Errore',
          message: messaggio,
          buttons: ['OK']
        });

        await alert.present();
      }
    });
  }
}
