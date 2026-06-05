import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import {
  IonContent, IonButton,
  IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonChip
} from '@ionic/angular/standalone';

import { Intervento } from 'src/app/models/intervento.model';
import { InterventiService } from '../../services/interventi.service'; // Importa il tuo service
import { HeaderComponent } from '../../components/header/header.component';

@Component({
  selector: 'app-dettaglio-intervento-dipendente',
  templateUrl: './dettaglio-intervento-dipendente.page.html',
  styleUrls: ['./dettaglio-intervento-dipendente.page.scss'],
  standalone: true,
  imports: [
    HeaderComponent,
    IonContent,
    IonButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonChip
  ]
})
export class DettaglioInterventoDipendentePage {

  interventoId = '';
  intervento: Intervento | null = null; // Inizializzato a null, nessun dato fittizio

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private alertController: AlertController,
    private interventiService: InterventiService // Inietta il service
  ) {
    this.interventoId = this.route.snapshot.paramMap.get('id') || '';
  }

  ionViewWillEnter() {
  this.caricaIntervento();
  }

  caricaIntervento() {
  this.interventiService.getInterventoDipendenteById(this.interventoId).subscribe({
    next: (intervento) => {
      this.intervento = intervento;
    },
    error: (err) => {
      console.error('Errore caricamento dettaglio intervento dipendente:', err);
    }
  });
}

  async modificaStatoIntervento() {
  if (!this.intervento) {
    return;
  }

  const alert = await this.alertController.create({
    header: 'Modifica stato intervento',
    message: 'Seleziona il nuovo stato di lavorazione.',
    cssClass: 'custom-dark-alert',
    inputs: [
      {
        type: 'radio',
        label: 'Programmato',
        value: 'Programmato',
        checked: this.intervento.stato_lavorazione === 'Programmato'
      },
      {
        type: 'radio',
        label: 'In lavorazione',
        value: 'In lavorazione',
        checked: this.intervento.stato_lavorazione === 'In lavorazione'
      },
      {
        type: 'radio',
        label: 'Terminato',
        value: 'Terminato',
        checked: this.intervento.stato_lavorazione === 'Terminato'
      }
    ],
    buttons: [
      {
        text: 'Annulla',
        role: 'cancel'
      },
      {
        text: 'Conferma',
        handler: (nuovoStato: 'Programmato' | 'In lavorazione' | 'Terminato') => {
          if (!nuovoStato || !this.intervento) {
            return false;
          }

          this.interventiService.aggiornaStatoLavorazioneDipendente(
            this.interventoId,
            nuovoStato
          ).subscribe({
            next: (res) => {
              this.intervento = res.intervento;
            },
            error: (err) => {
              console.error('Errore aggiornamento stato intervento:', err);
            }
          });

          return true;
        }
      }
    ]
  });

  await alert.present();
}
}
