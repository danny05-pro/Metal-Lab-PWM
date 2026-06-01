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
  IonModal, 
  IonItem,
  IonInput,
  IonSelect,
  IonSelectOption
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
    IonModal,
    IonItem,
    IonInput,
    IonSelect,
    IonSelectOption
  ]
})
export class DashboardAdminPage implements OnInit {

  // Metriche globali
  totalePreventivi = 5;
  ordiniAttivi = 12;
  interventiAperti = 8;
  vociCatalogo = 3; 
  interventi: Intervento[] = [
  {
    id: 1,
    cliente: 'Mario Rossi',
    descrizione: 'Riparazione impianto industriale',
    luogo: 'Stabilimento Napoli',
    priorita: 'Alta',
    stato: 'Da assegnare',
    dataOra: '2026-05-20',
    dataRichiesta: '2026-05-20',
    dataPreferita: '2026-05-25',
    dipendenteAssegnato: null,
    note: 'Il cliente segnala un blocco improvviso dell’impianto durante il ciclo produttivo.'
  }
];

  preventivi: Preventivo[] = [
  {
    id: 1,
    cliente: 'Mario Rossi',
    emailCliente: 'mario.rossi@email.it',
    descrizione: 'Realizzazione struttura metallica industriale per area produttiva.',
    servizio: 'Carpenteria metallica',
    materiale: 'Acciaio zincato',
    dimensioni: '3x2m',
    finitura: 'Zincatura',
    stato: 'In attesa',
    dataRichiesta: '2026-05-18',
    allegato: 'disegno-struttura.pdf',
    prezzoProposto: null
  },
  {
    id: 2,
    cliente: 'Tech S.p.A.',
    emailCliente: 'ufficio.tecnico@techspa.it',
    descrizione: 'Fornitura di piastre in acciaio tagliate su misura per macchinario industriale.',
    servizio: 'Taglio laser',
    materiale: 'Acciaio inox',
    dimensioni: '50x30cm',
    finitura: 'Satinatura',
    stato: 'Prezzo proposto',
    dataRichiesta: '2026-05-19',
    allegato: 'piastre-macchinario.dwg',
    prezzoProposto: 680
  }];

  catalogo: VoceCatalogo[] = [
    { id: 101, nome: 'Taglio Laser Lamiere', categoria: 'Lavorazioni', prezzoBase: 'Da €50/mq' },
    { id: 102, nome: 'Saldatura TIG', categoria: 'Carpenteria', prezzoBase: 'Da €40/ora' },
    { id: 103, nome: 'Manutenzione Pressa', categoria: 'Interventi', prezzoBase: 'Su preventivo' }
  ];

  storicoGlobale: EventoStorico[] = [
    { id: 1001, dataFormattata: '2026-05-20 - 10:30', descrizione: 'Completato Ordine #849', cliente: 'Industrie Verdi SRL', tipo: 'Ordine', stato: 'Consegnato' },
    { id: 1002, dataFormattata: '2026-05-19 - 16:00', descrizione: 'Preventivo accettato dal cliente', cliente: 'Mario Rossi', tipo: 'Preventivo', stato: 'Approvato' },
    { id: 1003, dataFormattata: '2026-05-18 - 09:15', descrizione: 'Manutenzione compressore completata', cliente: 'Autoofficina Bianchi', tipo: 'Intervento', stato: 'Risolto' }
  ];

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

  ngOnInit() {}


  modificaVoceCatalogo(id: number) {
    this.modalMode = 'modifica';
    const voce = this.catalogo.find(v => v.id === id);
    if (voce) {
      this.formCatalogo = { ...voce }; // Copia di sicurezza
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
      message: 'Sei sicuro di voler eliminare questa voce dal catalogo? Questa azione è irreversibile.',
      buttons: [
        {
          text: 'Annulla',
          role: 'cancel',
          cssClass: 'dark-alert-btn-cancel' // Stile grigio
        },
        {
          text: 'Elimina',
          role: 'destructive',
          cssClass: 'dark-alert-btn-danger', // Stile rosso
          handler: () => {
            this.catalogo = this.catalogo.filter(v => v.id !== id);
            this.vociCatalogo = this.catalogo.length; 
            console.log(`Voce catalogo ${id} eliminata con successo.`);
          }
        }
      ]
    });

    await alert.present();
  }
  aggiungiVoceCatalogo() {
    this.modalMode = 'crea';
    this.formCatalogo = {}; // Vuoto per mantenere il placeholder in trasparenza
    this.isModalOpen = true;
  }

  chiudiModale() {
    this.isModalOpen = false;
  }

  salvaVoceCatalogo() {
    if (!this.formCatalogoValido) {
  return;
}
    if (this.modalMode === 'crea') {
      const nuovaVoce: VoceCatalogo = {
        id: Date.now(),
        nome: this.formCatalogo.nome || '',
        categoria: this.formCatalogo.categoria || '',
        prezzoBase: this.formCatalogo.prezzoBase || 'Su preventivo'
      };
      this.catalogo.push(nuovaVoce);
      this.vociCatalogo = this.catalogo.length; // Aggiorna dinamicamente il contatore sopra!
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
    this.chiudiModale();
  }
}