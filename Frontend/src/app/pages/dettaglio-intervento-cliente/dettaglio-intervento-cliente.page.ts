import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import {
  IonContent,
  IonButton,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonChip,
  IonModal,
  IonDatetime,
  IonItem,
  IonLabel,
  IonInput
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';

import {
  checkmarkCircleOutline,
  calendarOutline,
  closeCircleOutline
} from 'ionicons/icons';

import { Intervento } from 'src/app/models/intervento.model';
import { InterventiService } from 'src/app/services/interventi.service';
import { HeaderComponent } from 'src/app/components/header/header.component';

@Component({
  selector: 'app-dettaglio-intervento-cliente',
  templateUrl: './dettaglio-intervento-cliente.page.html',
  styleUrls: ['./dettaglio-intervento-cliente.page.scss'],
  standalone: true,
  imports: [
    HeaderComponent,
    FormsModule,
    IonContent,
    IonButton,
    IonIcon,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonChip,
    IonModal,
    IonDatetime,
    IonItem,
    IonLabel,
    IonInput
  ]
})
export class DettaglioInterventoClientePage implements OnInit {

  interventoId = '';

  intervento: Intervento | null = null;

  caricamento = true;

  nuovaDataCliente = '';

  dataMinima = '';

  constructor(
    private route: ActivatedRoute,
    private alertController: AlertController,
    private interventiService: InterventiService
  ) {
    addIcons({
      checkmarkCircleOutline,
      calendarOutline,
      closeCircleOutline
    });

    const domani = new Date();
    domani.setDate(domani.getDate() + 1);

    const tzoffset = domani.getTimezoneOffset() * 60000;

    this.dataMinima = new Date(
      domani.getTime() - tzoffset
    ).toISOString().split('T')[0];
  }

  ngOnInit() {
    this.interventoId = this.route.snapshot.paramMap.get('id') || '';

    this.caricaIntervento();
  }

  caricaIntervento() {
    this.caricamento = true;

    this.interventiService.getInterventoClienteById(this.interventoId).subscribe({
      next: (intervento) => {
        this.intervento = intervento;
        this.caricamento = false;
      },
      error: (err) => {
        console.error('Errore caricamento dettaglio intervento cliente:', err);
        this.caricamento = false;
      }
    });
  }

  get puoRispondereAllaProposta(): boolean {
    return (
      !!this.intervento &&
      this.intervento.stato_admin === 'Data proposta' &&
      this.intervento.stato_risposta_cliente === 'In attesa' &&
      !!this.intervento.data_proposta_admin
    );
  }
get negoziazioneConclusa(): boolean {
  return (
    !!this.intervento &&
    (
      this.intervento.stato_admin === 'Intervento concordato' ||
      this.intervento.stato_admin === 'Rifiutato' ||
      this.intervento.stato_risposta_cliente === 'Data accettata' ||
      this.intervento.stato_risposta_cliente === 'Intervento annullato'
    )
  );
}
  get nuovaDataFormattata(): string {
    if (!this.nuovaDataCliente) {
      return '';
    }

    const d = new Date(this.nuovaDataCliente);

    return d.toLocaleDateString('it-IT');
  }

  accettaDataAdmin() {
    if (!this.intervento) {
      return;
    }

    this.interventiService.clienteRispondeData(this.interventoId, {
      azione: 'accetta_data'
    }).subscribe({
      next: () => {
        this.caricaIntervento();
      },
      error: (err) => {
        console.error('Errore accettazione data:', err);
      }
    });
  }

  confermaNuovaData() {
  if (!this.intervento || !this.nuovaDataCliente) {
    return;
  }

  const dataPulita = this.nuovaDataCliente.split('T')[0];

  this.interventiService.clienteRispondeData(this.interventoId, {
    azione: 'proponi_nuova_data',
    nuova_data: dataPulita
  }).subscribe({
    next: () => {
      this.nuovaDataCliente = '';
      this.caricaIntervento();
    },
    error: (err) => {
      console.error('Errore proposta nuova data:', err);
    }
  });}

  async annullaIntervento() {
  if (!this.intervento) {
    return;
  }

  const alert = await this.alertController.create({
    header: 'Annulla intervento',
    message: 'Vuoi annullare definitivamente questo intervento?',
    cssClass: 'custom-dark-alert',
    buttons: [
      {
        text: 'Indietro',
        role: 'cancel'
      },
      {
        text: 'Annulla intervento',
        role: 'destructive',
        handler: () => {
          this.interventiService.clienteRispondeData(this.interventoId, {
            azione: 'annulla_intervento'
          }).subscribe({
            next: () => {
              this.caricaIntervento();
            },
            error: (err) => {
              console.error('Errore annullamento intervento:', err);
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
