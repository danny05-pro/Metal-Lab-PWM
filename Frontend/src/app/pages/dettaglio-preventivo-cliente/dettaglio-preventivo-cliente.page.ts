import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { ActivatedRoute, Router, RouterLink } from '@angular/router'; 

import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonButton,
  IonIcon, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonChip
} from '@ionic/angular/standalone';

import {AlertController } from '@ionic/angular';

import { addIcons } from 'ionicons';
import { arrowBackOutline, documentAttachOutline } from 'ionicons/icons';

// Importiamo il service
import { PreventiviService } from '../../services/preventivi.service';

@Component({
  selector: 'app-dettaglio-preventivo-cliente',
  templateUrl: './dettaglio-preventivo-cliente.page.html',
  styleUrls: ['./dettaglio-preventivo-cliente.page.scss'],
  standalone: true,
  imports: [
    CommonModule, RouterLink, IonContent, IonHeader, IonTitle, IonToolbar,
    IonButtons, IonButton, IonIcon, IonCard, IonCardHeader, IonCardTitle,
    IonCardContent, IonChip
  ]
})
export class DettaglioPreventivoClientePage implements OnInit {

  preventivoId = '';
  preventivo: any = null; // <-- CORREZIONE 1: "any" sblocca l'errore di Angular!
  caricamento = true;

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private alertController: AlertController,
    private preventiviService: PreventiviService 
  ) {
    addIcons({ arrowBackOutline, documentAttachOutline });
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
      next: (dati: any) => {
        this.preventivo = dati;
        this.preventivo.allegatiArray = dati.allegato ? dati.allegato.split(',') : [];
        this.caricamento = false;
      },
      error: (err: any) => {
        console.error('Errore recupero preventivo', err);
        this.caricamento = false;
      }
    });
  }

  // <-- CORREZIONE 2: Ora i bottoni chiamano il VERO database
  async accettaPreventivo() {
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