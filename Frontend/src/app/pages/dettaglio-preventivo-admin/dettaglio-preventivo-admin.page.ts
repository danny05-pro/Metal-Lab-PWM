import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  IonContent, IonButton,
  IonIcon, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonChip
} from '@ionic/angular/standalone';
import { AlertController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { documentAttachOutline } from 'ionicons/icons';

import { PreventiviService } from 'src/app/services/preventivi.service';
import { PreventivoDettaglio } from 'src/app/models/preventivo.model';
import { HeaderComponent } from 'src/app/components/header/header.component';

@Component({
  selector: 'app-dettaglio-preventivo-admin',
  templateUrl: './dettaglio-preventivo-admin.page.html',
  styleUrls: ['./dettaglio-preventivo-admin.page.scss'],
  standalone: true,
  imports: [
    HeaderComponent,
    CommonModule, IonContent, IonButton, IonIcon, IonCard,
    IonCardHeader, IonCardTitle, IonCardContent, IonChip
  ]
})
export class DettaglioPreventivoAdminPage implements OnInit {

  preventivoId = '';
  preventivo: PreventivoDettaglio | null = null;
  caricamento = true;

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
    this.preventiviService.getPreventivoAdminById(this.preventivoId).subscribe({
      next: (dati) => {
        this.preventivo = {
          ...dati,
          allegatiArray: dati.allegato ? dati.allegato.split(',') : []
        };
        this.caricamento = false;
      },
      error: (err) => {
        console.error('Errore recupero preventivo admin:', err);
        this.caricamento = false;
      }
    });
  }

  // --- LOGICA REALE: RIFIUTA ---
  async rifiutaPreventivo() {
    const alert = await this.alertController.create({
      cssClass: 'custom-dark-alert',
      header: 'Rifiuta Preventivo',
      message: 'Sei sicuro di voler rifiutare la richiesta del cliente?',
      buttons: [
        { text: 'Annulla', role: 'cancel', cssClass: 'dark-alert-btn-cancel' },
        {
          text: 'Rifiuta', role: 'destructive', cssClass: 'dark-alert-btn-danger',
          handler: () => {
            // Chiamata vera al backend
            this.preventiviService.adminRifiutaPreventivo(this.preventivoId).subscribe({
              next: () => this.router.navigate(['/dashboard-admin']),
              error: (err) => console.error('Errore rifiuto preventivo:', err)
            });
          }
        }
      ]
    });
    await alert.present();
  }

  // --- LOGICA REALE: PROPONI PREZZO ---
  async proponiPrezzo() {
    const alert = await this.alertController.create({
      header: 'Proponi prezzo',
      message: 'Inserisci il prezzo in Euro.',
      cssClass: 'custom-dark-alert',
      inputs: [
        { name: 'prezzo', type: 'number', placeholder: 'Es. 250', cssClass: 'dark-alert-input', attributes: { min: '1' } }
      ],
      buttons: [
        { text: 'Annulla', role: 'cancel', cssClass: 'dark-alert-btn-cancel' },
        {
          text: 'Conferma', cssClass: 'dark-alert-btn-confirm',
          handler: (data: { prezzo?: string | number }) => {
            const prezzo = Number(data.prezzo);
            if (isNaN(prezzo) || prezzo <= 0) return false;

            // Chiamata vera al backend
            this.preventiviService.adminProponePrezzo(this.preventivoId, prezzo).subscribe({
              next: () => this.router.navigate(['/dashboard-admin']),
              error: (err) => console.error('Errore proposta prezzo:', err)
            });
            
            return true;
          }
        }
      ]
    });
    await alert.present();
  }
}
