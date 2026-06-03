import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { AlertController } from '@ionic/angular';

import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonCard,
  IonCardContent, IonCardHeader, IonCardTitle, IonGrid,
  IonRow, IonCol, IonChip, IonButton, IonButtons, IonIcon, IonModal
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import {
  arrowBackOutline, createOutline, addOutline,
  peopleOutline, saveOutline, trashOutline
} from 'ionicons/icons';

import { Intervento } from 'src/app/models/intervento.model';
import { Preventivo } from 'src/app/models/preventivo.model';
import { InterventiService } from 'src/app/services/interventi.service';

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
    CommonModule, RouterLink, FormsModule, IonContent, IonHeader,
    IonTitle, IonToolbar, IonCard, IonCardContent, IonCardHeader,
    IonCardTitle, IonGrid, IonRow, IonCol, IonChip, IonButton,
    IonButtons, IonIcon, IonModal
  ]
})
export class DashboardAdminPage implements OnInit {

  // Metriche globali
  totalePreventivi = 0;
  ordiniAttivi = 0;
  interventiAperti = 0;
  vociCatalogo = 0; 

  // --- VARIABILI CHE MANCAVANO (quelle che causavano il crash) ---
  tuttiGliInterventi: any[] = [];
  interventiFuturi: any[] = [];
  ordini: any[] = [];
  storicoOrdini: any[] = [];
  // -------------------------------------------------------------

  interventi: Intervento[] = [];
  preventivi: Preventivo[] = [{
      id: 1,
      cliente_id: 1,
      descrizione: 'Struttura metallica industriale',
      servizio: 'Saldatura',
      materiale: 'Acciaio',
      dimensioni: '3x2m',
      finitura: 'Zincatura',
      stato_admin: 'Da valutare',
      stato_risposta_cliente: 'In attesa'
    },
    {
      id: 2,
      cliente_id: 2,
      descrizione: 'Cancello automatico',
      servizio: 'Taglio laser',
      materiale: 'Alluminio',
      dimensioni: '2x1m',
      finitura: 'Verniciatura',
      stato_admin: 'Prezzo proposto',
      stato_risposta_cliente: 'In attesa'
    }];
  catalogo: VoceCatalogo[] = [];
  storicoGlobale: EventoStorico[] = [];

  isModalOpen = false;
  modalMode: 'crea' | 'modifica' = 'crea';
  formCatalogo: Partial<VoceCatalogo> = {};

  constructor(
    private alertController: AlertController,
    private interventiService: InterventiService
  ) {
    addIcons({
      arrowBackOutline, createOutline, addOutline,
      peopleOutline, saveOutline, trashOutline
    });
  }

  ngOnInit() {
    this.caricaInterventiAdmin();
  }

  caricaInterventiAdmin() {
    this.interventiService.getInterventiAdmin().subscribe({
      next: (interventi) => {
        // Sincronizziamo le variabili per l'HTML
        this.interventi = interventi;
        this.tuttiGliInterventi = interventi; 
        
        this.interventiAperti = interventi.filter(
          intervento =>
            intervento.stato_admin !== 'Rifiutato' &&
            intervento.stato_risposta_cliente !== 'Intervento annullato' &&
            intervento.stato_lavorazione !== 'Terminato'
        ).length;
      },
      error: (err) => {
        console.error('Errore caricamento interventi admin:', err);
      }
    });
  }

  // --- LOGICA CATALOGO INVARIATA ---
  modificaVoceCatalogo(id: number) { /* ... */ }
  get formCatalogoValido(): boolean { /* ... */ return true; }
  async eliminaVoceCatalogo(id: number) { /* ... */ }
  aggiungiVoceCatalogo() { /* ... */ }
  chiudiModale() { /* ... */ }
  salvaVoceCatalogo() { /* ... */ }
}