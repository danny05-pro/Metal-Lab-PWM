import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AlertController } from '@ionic/angular';

// IMPORT HTTP AGGIUNTI QUI DIRETTAMENTE
import { HttpClient, HttpHeaders } from '@angular/common/http'; 

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

export interface Dipendente {
  id?: number; 
  nome: string;
  cognome: string;
  email: string;
  telefono: string; 
  stato?: string; 
  password?: string;
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
  
  dipendenti: Dipendente[] = [];
  isModalOpen = false;
  modalMode: 'crea' | 'modifica' = 'crea';
  formDipendente: Partial<Dipendente> & { password?: string } = {};

  // INDIRIZZO DEL BACKEND INSERITO DIRETTAMENTE QUI
  private apiUrl = 'http://localhost:3000/api/gestione-dipendenti';

  constructor(
    private alertController: AlertController,
    private http: HttpClient // INIETTATO HTTPCLIENT DIRETTAMENTE QUI
  ) {
    addIcons({
      arrowBackOutline, addOutline, createOutline, trashOutline,
      personOutline, closeOutline, saveOutline, callOutline 
    });
  }

  // FUNZIONE PER CREARE GLI HEADERS CON IL TOKEN INCLUSA QUI
  private getHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token'); 
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
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

  // CHIAMATA GET DIRETTA
  caricaDipendenti() {
    this.http.get<Dipendente[]>(this.apiUrl, { headers: this.getHeaders() }).subscribe({
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
      // CHIAMATA POST DIRETTA
      this.http.post<Dipendente>(this.apiUrl, this.formDipendente, { headers: this.getHeaders() }).subscribe({
        next: () => {
          this.caricaDipendenti(); 
          this.chiudiModale();
        },
        error: (err: any) => console.error('Errore durante la creazione', err)
      });
    
    } else {
      if (this.formDipendente.id) {
        // CHIAMATA PUT DIRETTA
        this.http.put(`${this.apiUrl}/${this.formDipendente.id}`, this.formDipendente, { headers: this.getHeaders() }).subscribe({
          next: () => {
            this.caricaDipendenti(); 
            this.chiudiModale();
          },
          error: (err: any) => console.error('Errore durante la modifica', err)
        });
      }
    }
  }

  eliminaDipendente(id: number) {
    // CHIAMATA DELETE DIRETTA
    this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() }).subscribe({
      next: () => {
        this.dipendenti = this.dipendenti.filter((dipendente: Dipendente) => dipendente.id !== id);
      },
      error: (err: any) => console.error('Errore durante l\'eliminazione', err)
    });
  }
}