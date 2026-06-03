import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';

// 1. Aggiungiamo l'AlertController per la gestione visiva degli errori
import { AlertController } from '@ionic/angular';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonButtons,
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

@Component({
  selector: 'app-preventivi',
  templateUrl: './preventivi.page.html',
  styleUrls: ['./preventivi.page.scss'],
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonButtons,
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
  allegatiNomi: string[] = [];

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
    this.allegatiNomi = []; 

    if (input.files && input.files.length > 0) {
      for (let i = 0; i < input.files.length; i++) {
        this.allegatiNomi.push(input.files[i].name);
      }
    }
  }

  svuotaAllegati() {
    this.allegatiNomi = [];
  }

  // 4. Invio REALE al database
  inviaPreventivo() {
    if (!this.formValido) return;

    // Convertiamo l'array di file in una stringa separata da virgole per rispettare la colonna SQLite
    const stringaAllegati = this.allegatiNomi.length > 0 
      ? this.allegatiNomi.join(', ') 
      : undefined;

    const payload: PreventivoRichiesta = {
      descrizione: this.descrizione,
      servizio: this.servizio,
      materiale: this.materiale,
      dimensioni: this.dimensioni,
      finitura: this.finitura || undefined, // Evitiamo stringhe vuote, passiamo undefined per generare NULL
      allegato: stringaAllegati
    };

    // Chiamata HTTP
    this.preventiviService.creaPreventivo(payload).subscribe({
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