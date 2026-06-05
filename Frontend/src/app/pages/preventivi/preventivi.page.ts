import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

// 1. Aggiungiamo l'AlertController per la gestione visiva degli errori
import { AlertController } from '@ionic/angular';

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
  IonCardContent
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import { arrowBackOutline, documentAttachOutline, trashOutline } from 'ionicons/icons';

// 2. Importiamo il nostro nuovo Service
import { PreventiviService, PreventivoRichiesta } from '../../services/preventivi.service';
import { HeaderComponent } from '../../components/header/header.component';

@Component({
  selector: 'app-preventivi',
  templateUrl: './preventivi.page.html',
  styleUrls: ['./preventivi.page.scss'],
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
    IonCardContent
  ]
})
export class PreventiviPage {

  // RIGOROSAMENTE NESSUN DATO FITTIZIO: solo contenitori vuoti per il form
  descrizione: string = '';
  servizio: string = '';
  materiale: string = '';
  dimensioni: string = '';
  finitura: string = '';
  allegatiFiles: File[] = [];

  preventivoInviato: boolean = false;
  isMac: boolean = false;

  get formValido(): boolean {
    return (
      this.descrizione.trim() !== '' &&
      this.servizio.trim() !== '' &&
      this.materiale.trim() !== '' &&
      this.dimensioni.trim() !== ''
    );
  }

  // 3. Iniettiamo il service e l'alert controller
  constructor(
    private router: Router,
    private preventiviService: PreventiviService,
    private alertController: AlertController
  ) {
    addIcons({
      arrowBackOutline,
      documentAttachOutline,
      trashOutline
    });

    this.isMac = navigator.userAgent.toLowerCase().includes('mac');
  }

selezionaFile(event: Event) {
    const input = event.target as HTMLInputElement;
    this.allegatiFiles = []; 
    if (input.files && input.files.length > 0) {
      for (let i = 0; i < input.files.length; i++) {
        this.allegatiFiles.push(input.files[i]); // Salviamo il file VERO
      }
    }
  }

  svuotaAllegati() {
    this.allegatiFiles = [];
  }

inviaPreventivo() {
    if (!this.formValido) return;

    // 1. Creiamo il pacchetto dati FormData (abbandoniamo il vecchio oggetto "payload")
    const formData = new FormData();
    formData.append('descrizione', this.descrizione);
    formData.append('servizio', this.servizio);
    formData.append('materiale', this.materiale);
    formData.append('dimensioni', this.dimensioni);
    
    if (this.finitura) {
      formData.append('finitura', this.finitura);
    }

    // 2. Aggiungiamo tutti i file fisici uno ad uno
    this.allegatiFiles.forEach(file => {
      formData.append('allegati', file);
    });

    // 3. Passiamo direttamente formData al service
    this.preventiviService.creaPreventivo(formData).subscribe({
      next: () => {
        this.preventivoInviato = true;

        setTimeout(() => {
          this.router.navigate(['/dashboard-cliente']);
        }, 1500);
      },
      error: async (err: any) => {
        console.error('Errore invio preventivo:', err);
        const messaggio = err.error?.message || 'Errore di connessione al server.';

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
