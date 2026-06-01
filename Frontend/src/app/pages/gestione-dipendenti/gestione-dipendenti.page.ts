import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AlertController } from '@ionic/angular';

import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonChip,
  IonModal,
  IonInput,
  IonInputPasswordToggle
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import {
  arrowBackOutline,
  addOutline,
  createOutline,
  trashOutline,
  personOutline,
  closeOutline,
  saveOutline,
  callOutline
} from 'ionicons/icons';

// 1. IMPORTIAMO IL SERVICE E L'INTERFACCIA
// (Assicurati che il percorso relativo sia corretto)
import { DipendentiService, Dipendente } from '../../services/dipendenti.service';

@Component({
  selector: 'app-gestione-dipendenti',
  templateUrl: './gestione-dipendenti.page.html',
  styleUrls: ['./gestione-dipendenti.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonButton,
    IonIcon,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonChip,
    IonModal,
    IonInput,
    IonInputPasswordToggle
  ]
})
export class GestioneDipendentiPage implements OnInit {
  
  dipendenti: Dipendente[] = [];
  isModalOpen = false;
  modalMode: 'crea' | 'modifica' = 'crea';
  formDipendente: Partial<Dipendente> & { password?: string } = {};

  // 2. INIETTIAMO IL SERVICE AL POSTO DI HTTPCLIENT
  constructor(
    private alertController: AlertController,
    private dipendentiService: DipendentiService 
  ) {
    addIcons({
      arrowBackOutline, addOutline, createOutline, trashOutline,
      personOutline, closeOutline, saveOutline, callOutline 
    });
  }

  get formDipendenteValido(): boolean {
    const nomeValido = (this.formDipendente.nome?.trim() ?? '') !== '';
    const cognomeValido = (this.formDipendente.cognome?.trim() ?? '') !== '';
    const emailValido = (this.formDipendente.email?.trim() ?? '') !== '';
    const telefonoValido = (this.formDipendente.telefono?.trim() ?? '') !== '';
    
    if (this.modalMode === 'crea') {
      const passwordValida = (this.formDipendente.password?.trim() ?? '') !== '';
      return nomeValido && cognomeValido && emailValido && telefonoValido && passwordValida;
    } else {
      return nomeValido && cognomeValido && emailValido && telefonoValido;
    }
  }

  async confermaEliminazioneDipendente(dipendente: Dipendente) {
    const alert = await this.alertController.create({
      cssClass: 'custom-dark-alert',
      header: 'Eliminare dipendente?',
      message: `Vuoi eliminare l’account di ${dipendente.nome} ${dipendente.cognome}? Questa azione è irreversibile.`,
      buttons: [
        { text: 'Annulla', role: 'cancel', cssClass: 'dark-alert-btn-cancel' },
        {
          text: 'Elimina', role: 'destructive', cssClass: 'dark-alert-btn-danger',
          handler: () => {
            if(dipendente.id) {
              this.eliminaDipendente(dipendente.id);
            }
          }
        }
      ]
    });
    await alert.present();
  }

  ngOnInit() {
    this.caricaDipendenti();
  }

  // 3. USO DEL SERVICE: GET
  caricaDipendenti() {
    this.dipendentiService.getDipendenti().subscribe({
      next: (datiReali: Dipendente[]) => {
        this.dipendenti = datiReali.map((d: Dipendente) => ({ ...d, stato: 'Attivo' }));
      },
      error: (err: any) => console.error('Errore nel recupero dipendenti', err)
    });
  }

  apriModaleCrea() {
    this.modalMode = 'crea';
    this.formDipendente = { stato: 'Attivo' }; 
    this.isModalOpen = true;
  }

  apriModaleModifica(dipendente: Dipendente) {
    this.modalMode = 'modifica';
    this.formDipendente = { ...dipendente }; 
    this.isModalOpen = true;
  }

  chiudiModale() {
    this.isModalOpen = false;
  }

  salvaDipendente() {
    if (!this.formDipendenteValido) return;

    if (this.modalMode === 'crea') {
      // CHIAMATA POST
      this.dipendentiService.creaDipendente(this.formDipendente as Dipendente).subscribe({
        next: () => {
          this.caricaDipendenti(); 
          this.chiudiModale();
        },
        error: async (err: any) => {
          console.error('Errore durante la creazione', err);
          // MOSTRIAMO L'ERRORE DEL BACKEND A SCHERMO
          const messaggio = err.error?.message || 'Si è verificato un errore di connessione.';
          const alert = await this.alertController.create({
            cssClass: 'custom-dark-alert',
            header: 'Errore di Creazione',
            message: messaggio,
            buttons: ['OK']
          });
          await alert.present();
        }
      });
    
    } else {
      if (this.formDipendente.id) {
        // CHIAMATA PUT
        this.dipendentiService.modificaDipendente(this.formDipendente.id, this.formDipendente as Dipendente).subscribe({
          next: () => {
            this.caricaDipendenti(); 
            this.chiudiModale();
          },
          error: async (err: any) => {
            console.error('Errore durante la modifica', err);
            // MOSTRIAMO L'ERRORE DEL BACKEND A SCHERMO
            const messaggio = err.error?.message || 'Si è verificato un errore durante il salvataggio.';
            const alert = await this.alertController.create({
              cssClass: 'custom-dark-alert',
              header: 'Errore di Modifica',
              message: messaggio,
              buttons: ['OK']
            });
            await alert.present();
          }
        });
      }
    }
  }

  // 6. USO DEL SERVICE: DELETE
  eliminaDipendente(id: number) {
    this.dipendentiService.eliminaDipendente(id).subscribe({
      next: () => {
        this.dipendenti = this.dipendenti.filter((dipendente: Dipendente) => dipendente.id !== id);
      },
      error: (err: any) => console.error('Errore durante l\'eliminazione', err)
    });
  }
}