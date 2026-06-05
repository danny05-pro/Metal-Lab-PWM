import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import {
  IonContent, IonButton,
  IonIcon, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonChip
} from '@ionic/angular/standalone';

import {AlertController } from '@ionic/angular';

import { addIcons } from 'ionicons';
import { documentAttachOutline } from 'ionicons/icons';


import { PreventiviService } from '../../services/preventivi.service';
import { HeaderComponent } from '../../components/header/header.component';
import { Preventivo, PreventivoDettaglio } from '../../models/preventivo.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-dettaglio-preventivo-cliente',
  templateUrl: './dettaglio-preventivo-cliente.page.html',
  styleUrls: ['./dettaglio-preventivo-cliente.page.scss'],
  standalone: true,
  imports: [
    HeaderComponent,
    CommonModule, IonContent,
    IonButton, IonIcon, IonCard, IonCardHeader, IonCardTitle,
    IonCardContent, IonChip
  ]
})
export class DettaglioPreventivoClientePage implements OnInit {

  preventivoId = '';
  preventivo: PreventivoDettaglio | null = null;
  caricamento = true;
  apiBaseUrl = environment.serverBaseUrl;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private alertController: AlertController,
    private preventiviService: PreventiviService
  ) {
    addIcons({ documentAttachOutline });
    this.preventivoId = this.route.snapshot.paramMap.get('id') || '';
  }

  ngOnInit() {
    if (this.preventivoId) {
      this.caricaPreventivo();
    }
  }

  caricaPreventivo() {
    this.caricamento = true;
    this.preventiviService.getPreventivoClienteById(this.preventivoId).subscribe({
      next: (dati: Preventivo) => {
        this.preventivo = {
          ...dati,
          allegatiArray: dati.allegato ? dati.allegato.split(',') : []
        };
        this.caricamento = false;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Errore recupero preventivo', err);
        this.caricamento = false;
      }
    });
  }


  async accettaPreventivo() {
    if (!this.preventivo) return;

    const alert = await this.alertController.create({
      cssClass: 'custom-dark-alert',
      header: 'Conferma Accettazione',
      message: `Vuoi accettare ufficialmente il preventivo di € ${this.preventivo.prezzo_proposto}?`,
      buttons: [
        { text: 'Annulla', role: 'cancel', cssClass: 'dark-alert-btn-cancel' },
        {
          text: 'Accetta',
          cssClass: 'dark-alert-btn-confirm',
          handler: () => {
            this.eseguiRisposta('accetta');
          }
        }
      ]
    });
    await alert.present();
  }

  async rifiutaPreventivo() {
    const alert = await this.alertController.create({
      cssClass: 'custom-dark-alert',
      header: 'Rifiuta Preventivo',
      message: 'Sei sicuro di voler rifiutare questa proposta? L\'azione è irreversibile.',
      buttons: [
        { text: 'Annulla', role: 'cancel', cssClass: 'dark-alert-btn-cancel' },
        {
          text: 'Rifiuta',
          role: 'destructive',
          cssClass: 'dark-alert-btn-danger',
          handler: () => {
            this.eseguiRisposta('rifiuta');
          }
        }
      ]
    });
    await alert.present();
  }

   private eseguiRisposta(azione: 'accetta' | 'rifiuta') {
    this.preventiviService.rispondiPreventivo(this.preventivoId, azione).subscribe({
      next: () => {
        // Appena il server risponde "OK", torniamo alla dashboard!
        this.router.navigate(['/dashboard-cliente']);
      },
      error: async (err) => {
        console.error('Errore risposta preventivo:', err);
        const alertError = await this.alertController.create({
          cssClass: 'custom-dark-alert',
          header: 'Errore',
          message: 'Impossibile inviare la risposta. Riprova.',
          buttons: ['OK']
        });
        await alertError.present();
      }
    });
  }


}
