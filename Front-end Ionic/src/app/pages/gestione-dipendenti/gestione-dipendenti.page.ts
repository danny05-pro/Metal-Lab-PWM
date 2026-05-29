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
  saveOutline
} from 'ionicons/icons';

interface Dipendente {
  id: number;
  nome: string;
  cognome: string;
  email: string;
  stato: 'Attivo' | 'Sospeso';
}

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
  
  // Dati Mock (In futuro arriveranno dal backend tramite GET /api/utenti?ruolo=dipendente)
  dipendenti: Dipendente[] = [
    { id: 1, nome: 'Marco', cognome: 'Bianchi', email: 'marco.bianchi@metallab.it', stato: 'Attivo' },
    { id: 2, nome: 'Giuseppe', cognome: 'Verdi', email: 'giuseppe.verdi@metallab.it', stato: 'Attivo' },
    { id: 3, nome: 'Luigi', cognome: 'Russo', email: 'luigi.russo@metallab.it', stato: 'Sospeso' }
  ];

  // Variabili per il Modale
  isModalOpen = false;
  modalMode: 'crea' | 'modifica' = 'crea';
  
  // Campi del form
  formDipendente: Partial<Dipendente> & { password?: string } = {};

  constructor(private alertController: AlertController) {
    addIcons({
      arrowBackOutline,
      addOutline,
      createOutline,
      trashOutline,
      personOutline,
      closeOutline,
      saveOutline
    });
  }
get formDipendenteValido(): boolean {
  const nomeValido = (this.formDipendente.nome?.trim() ?? '') !== '';
  const cognomeValido = (this.formDipendente.cognome?.trim() ?? '') !== '';
  const emailValido = (this.formDipendente.email?.trim() ?? '') !== '';
  
  if (this.modalMode === 'crea') {
    // In creazione la password DEVE esserci
    const passwordValida = (this.formDipendente.password?.trim() ?? '') !== '';
    return nomeValido && cognomeValido && emailValido && passwordValida;
  } else {
    // In modifica puoi anche lasciare il campo password vuoto (se non vuoi cambiarla)
    return nomeValido && cognomeValido && emailValido;
  }
}
async confermaEliminazioneDipendente(dipendente: Dipendente) {
    const alert = await this.alertController.create({
      cssClass: 'custom-dark-alert', // <--- Usa il tema scuro globale che abbiamo già creato!
      header: 'Eliminare dipendente?',
      message: `Vuoi eliminare l’account di ${dipendente.nome} ${dipendente.cognome}? Questa azione è irreversibile.`,
      buttons: [
        {
          text: 'Annulla',
          role: 'cancel',
          cssClass: 'dark-alert-btn-cancel' // <--- Usa lo stile grigio per annullare
        },
        {
          text: 'Elimina',
          role: 'destructive',
          cssClass: 'dark-alert-btn-danger', // <--- Nuova classe per il tasto rosso!
          handler: () => {
            this.eliminaDipendente(dipendente.id);
          }
        }
      ]
    });
    await alert.present();
  }

  ngOnInit() {}

  apriModaleCrea() {
    this.modalMode = 'crea';
    this.formDipendente = { stato: 'Attivo' }; // Valore di default
    this.isModalOpen = true;
  }

  apriModaleModifica(dipendente: Dipendente) {
    this.modalMode = 'modifica';
    // Copiamo i dati per non modificare l'originale fino al salvataggio
    this.formDipendente = { ...dipendente }; 
    this.isModalOpen = true;
  }

  chiudiModale() {
    this.isModalOpen = false;
  }

  salvaDipendente() {
  if (this.modalMode === 'crea') {
    // ID fittizio per il test
    if (!this.formDipendenteValido) {
  return;
}
    const nuovoDipendente: Dipendente = {
      id: Date.now(), 
      nome: this.formDipendente.nome || '',
      cognome: this.formDipendente.cognome || '',
      email: this.formDipendente.email || '',
      stato: 'Attivo'
    };
    
    this.dipendenti.push(nuovoDipendente);
  
  }else {
      // --- LOGICA DI MODIFICA (Simulata) ---
      // Cerchiamo la posizione (l'indice) del dipendente nel nostro array usando il suo ID
      const index = this.dipendenti.findIndex(d => d.id === this.formDipendente.id);
      
      if (index !== -1) {
        // Sovrascriviamo l'oggetto vecchio con i nuovi dati presenti nel form
        this.dipendenti[index] = {
          id: this.formDipendente.id!,
          nome: this.formDipendente.nome || '',
          cognome: this.formDipendente.cognome || '',
          email: this.formDipendente.email || '',
          stato: this.formDipendente.stato || 'Attivo'
        };
        console.log('Dipendente aggiornato visivamente con ID:', this.formDipendente.id);
      }
    }
    
    // Chiudiamo il modale in entrambi i casi
    this.chiudiModale();
  }

  eliminaDipendente(id: number) {
  this.dipendenti = this.dipendenti.filter(
    dipendente => dipendente.id !== id
  );
}
}