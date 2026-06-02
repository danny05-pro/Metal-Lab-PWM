import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { AlertController } from '@ionic/angular';

import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonGrid,
  IonRow,
  IonCol,
  IonChip,
  IonButton,
  IonButtons,
  IonIcon,
  IonModal
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import {
  arrowBackOutline,
  createOutline,
  addOutline,
  peopleOutline,
  saveOutline,
  trashOutline
} from 'ionicons/icons';

import { Intervento } from 'src/app/models/intervento.model';
import { Preventivo } from 'src/app/models/preventivo.model';

interface VoceCatalogo {
  id: number;
  nome: string;
  categoria: string;
  prezzoBase: string;
}

interface EventoStorico {
  id: number;
  dataFormattata: string;
  descrizione: string;
  cliente: string;
  tipo: 'Ordine' | 'Intervento' | 'Preventivo';
  stato: string;
}

@Component({
  selector: 'app-dashboard-admin',
  templateUrl: './dashboard-admin.page.html',
  styleUrls: ['./dashboard-admin.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonGrid,
    IonRow,
    IonCol,
    IonChip,
    IonButton,
    IonButtons,
    IonIcon,
    IonModal
  ]
})
export class DashboardAdminPage implements OnInit {

  // Metriche globali (inizializzate a 0)
  totalePreventivi = 0;
  ordiniAttivi = 0;
  interventiAperti = 0;
  vociCatalogo = 0; 

  // Array pronti per il backend
  interventi: Intervento[] = [];
  preventivi: Preventivo[] = [];
  catalogo: VoceCatalogo[] = [];
  storicoGlobale: EventoStorico[] = [];

  isModalOpen = false;
  modalMode: 'crea' | 'modifica' = 'crea';
  formCatalogo: Partial<VoceCatalogo> = {};

  constructor(private alertController: AlertController) {
    addIcons({
      arrowBackOutline,
      createOutline,
      addOutline,
      peopleOutline,
      saveOutline,
      trashOutline
    });
  }

  ngOnInit() {
    // Inizializza qui le chiamate ai tuoi Service (es: this.caricaDati())
  }

  // --- LOGICA CATALOGO ---
  modificaVoceCatalogo(id: number) {
    this.modalMode = 'modifica';
    const voce = this.catalogo.find(v => v.id === id);
    if (voce) {
      this.formCatalogo = { ...voce };
      this.isModalOpen = true;
    }
  }

  get formCatalogoValido(): boolean {
    return (
      (this.formCatalogo.nome?.trim() ?? '') !== '' &&
      (this.formCatalogo.categoria?.trim() ?? '') !== ''
    );
  }

  async eliminaVoceCatalogo(id: number) {
    const alert = await this.alertController.create({
      cssClass: 'custom-dark-alert', 
      header: 'Eliminare voce?',
      message: 'Sei sicuro di voler eliminare questa voce dal catalogo?',
      buttons: [
        { text: 'Annulla', role: 'cancel' },
        {
          text: 'Elimina',
          role: 'destructive',
          handler: () => {
            this.catalogo = this.catalogo.filter(v => v.id !== id);
            this.vociCatalogo = this.catalogo.length; 
          }
        }
      ]
    });
    await alert.present();
  }

  aggiungiVoceCatalogo() {
    this.modalMode = 'crea';
    this.formCatalogo = {}; 
    this.isModalOpen = true;
  }

  chiudiModale() {
    this.isModalOpen = false;
  }

  salvaVoceCatalogo() {
    if (!this.formCatalogoValido) return;

    if (this.modalMode === 'crea') {
      const nuovaVoce: VoceCatalogo = {
        id: Date.now(),
        nome: this.formCatalogo.nome || '',
        categoria: this.formCatalogo.categoria || '',
        prezzoBase: this.formCatalogo.prezzoBase || 'Su preventivo'
      };
      this.catalogo.push(nuovaVoce);
    } else {
      const index = this.catalogo.findIndex(v => v.id === this.formCatalogo.id);
      if (index !== -1) {
        this.catalogo[index] = {
          id: this.formCatalogo.id!,
          nome: this.formCatalogo.nome || '',
          categoria: this.formCatalogo.categoria || '',
          prezzoBase: this.formCatalogo.prezzoBase || 'Su preventivo'
        };
      }
    }
    this.vociCatalogo = this.catalogo.length;
    this.chiudiModale();
  }
}