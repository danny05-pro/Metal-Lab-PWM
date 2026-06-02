import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

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

// 1. IMPORTIAMO IL SERVICE DEGLI INTERVENTI
import { InterventiService, InterventoRichiesta } from '../../services/interventi.service';

@Component({
  selector: 'app-interventi',
  templateUrl: './interventi.page.html',
  styleUrls: ['./interventi.page.scss'],
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
    IonCardContent,
    IonDatetime,
    IonModal
  ]
})
export class InterventiPage {
  descrizione = '';
  luogo = '';
  priorita = '';
  dataIntervento: string | undefined;
  interventoInviato = false;
  
  dataMinima: string;

  get dataFormattata(): string {
    if (!this.dataIntervento) return '';
    const d = new Date(this.dataIntervento);
    return d.toLocaleDateString('it-IT');
  }

  // 2. INIETTIAMO SERVICE E ALERTCONTROLLER
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
    this.dataMinima = (new Date(domani.getTime() - tzoffset)).toISOString().split('T')[0];
  }

  get formValido(): boolean {
    return (
      this.descrizione.trim() !== '' &&
      this.luogo.trim() !== '' &&
      this.priorita.trim() !== '' 
    );
  }

  // 3. SOSTITUIAMO IL VECCHIO CODICE CON LA VERA CHIAMATA HTTP
  inviaIntervento() {
    if (!this.formValido) return;

    // Prepariamo l'oggetto per il backend
    const dati: InterventoRichiesta = {
      descrizione: this.descrizione,
      luogo: this.luogo,
      priorita: this.priorita,
      data_proposta_cliente: this.dataIntervento ? this.dataIntervento.split('T')[0] : undefined
    };

    this.interventiService.creaIntervento(dati).subscribe({
      next: () => {
        this.interventoInviato = true;
        // Aspettiamo un secondo e mezzo per far leggere il messaggio di successo prima di cambiare pagina
        setTimeout(() => {
          this.router.navigate(['/dashboard-cliente']);
        }, 1500);
      },
      error: async (err: any) => {
        console.error('Errore invio richiesta', err);
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