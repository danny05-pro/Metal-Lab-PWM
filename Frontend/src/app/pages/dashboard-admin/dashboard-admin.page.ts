import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { AlertController } from '@ionic/angular';

import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardContent,
  IonCardHeader, IonCardTitle, IonGrid, IonRow, IonCol, IonChip, IonButton,
  IonButtons, IonIcon, IonModal, IonItem, IonInput, IonSelect, IonSelectOption, IonFooter
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import { arrowBackOutline, createOutline, addOutline, peopleOutline, saveOutline, trashOutline, closeOutline, cameraOutline } from 'ionicons/icons';

import { Intervento } from 'src/app/models/intervento.model';
import { Preventivo } from 'src/app/models/preventivo.model';
import { InterventiService } from 'src/app/services/interventi.service';
import { PreventiviService } from 'src/app/services/preventivi.service';

// IMPORTIAMO IL NUOVO SERVICE
import { CatalogoService, VoceCatalogo } from 'src/app/services/catalogo.service';


@Component({
  selector: 'app-dashboard-admin',
  templateUrl: './dashboard-admin.page.html',
  styleUrls: ['./dashboard-admin.page.scss'],
  standalone: true,
  imports: [
    CommonModule, RouterLink, FormsModule, IonContent, IonHeader, IonTitle,
    IonToolbar, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonGrid,
    IonRow, IonCol, IonChip, IonButton, IonButtons, IonIcon, IonModal, IonItem,
    IonInput, IonSelect, IonSelectOption, IonFooter
  ]
})
export class DashboardAdminPage implements OnInit {

  // Metriche globali
  totalePreventivi = 0;
  ordiniAttivi = 0;
  interventiAperti = 0;
  vociCatalogo = 0; 

  // Array
  interventi: Intervento[] = [];
  preventivi: Preventivo[] = [];
  catalogo: VoceCatalogo[] = [];
  storicoGlobale: any[] = [];

  isModalOpen = false;
  modalMode: 'crea' | 'modifica' = 'crea';
  formCatalogo: Partial<VoceCatalogo> = {};

  constructor(
    private alertController: AlertController,
    private interventiService: InterventiService,
    private preventiviService: PreventiviService,
    private catalogoService: CatalogoService // <--- INIETTATO QUI
  ) {
    addIcons({
      arrowBackOutline, createOutline, addOutline, peopleOutline, 
      saveOutline, trashOutline, closeOutline, cameraOutline
    });
  }

  ngOnInit() {
    this.caricaInterventiAdmin();
    this.caricaPreventiviAdmin();
    this.caricaCatalogo(); 
  }

  // ... (caricaInterventiAdmin e caricaPreventiviAdmin rimangono INVARIATI) ...
  caricaInterventiAdmin() {
    this.interventiService.getInterventiAdmin().subscribe({
      next: (interventi) => {
        this.interventi = interventi;
        this.interventiAperti = interventi.filter(
          intervento =>
            intervento.stato_admin !== 'Rifiutato' &&
            intervento.stato_risposta_cliente !== 'Intervento annullato' &&
            intervento.stato_lavorazione !== 'Terminato'
        ).length;
      },
      error: (err) => console.error('Errore caricamento interventi admin:', err)
    });
  }

  caricaPreventiviAdmin() {
    this.preventiviService.getPreventiviAdmin().subscribe({
      next: (datiReali) => {
        this.preventivi = datiReali;
        this.totalePreventivi = datiReali.filter(p => p.stato_admin === 'Da valutare').length;
      },
      error: (err) => console.error('Errore caricamento preventivi admin:', err)
    });
  }

  // ==========================================
  // NUOVA LOGICA CATALOGO CON CHIAMATE HTTP
  // ==========================================

  caricaCatalogo() {
    this.catalogoService.getCatalogo().subscribe({
      next: (dati) => {
        // Mappiamo prezzo_base a prezzoBase per retrocompatibilità se necessario
        this.catalogo = dati.map(v => ({
            ...v,
            prezzoBase: v.prezzo_base || v.prezzoBase
        }));
        this.vociCatalogo = this.catalogo.length;
      },
      error: (err) => console.error('Errore caricamento catalogo:', err)
    });
  }

  aggiungiVoceCatalogo() {
    this.modalMode = 'crea';
    this.formCatalogo = { categoria: 'Prodotto' }; // Default iniziale
    this.isModalOpen = true;
  }

  modificaVoceCatalogo(id: number | undefined) {
    if (!id) return;
    const voce = this.catalogo.find(v => v.id === id);
    if (voce) {
      this.modalMode = 'modifica';
      this.formCatalogo = { ...voce };
      this.isModalOpen = true;
    }
  }

  chiudiModale() {
    this.isModalOpen = false;
  }

  get formCatalogoValido(): boolean {
    return (
      (this.formCatalogo.nome?.trim() ?? '') !== '' &&
      (this.formCatalogo.categoria?.trim() ?? '') !== ''
    );
  }

nomeFileSelezionato: string = '';
  fileDaCaricare: File | null = null;

onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.fileDaCaricare = file;
      this.nomeFileSelezionato = file.name;
      
      // Crea un URL locale per l'anteprima immediata
      this.formCatalogo.immagine = URL.createObjectURL(file);
    }
  }

  salvaVoceCatalogo() {
    if (!this.formCatalogoValido) return;

    const formData = new FormData();
    formData.append('nome', this.formCatalogo.nome!);
    formData.append('categoria', this.formCatalogo.categoria!);
    formData.append('prezzoBase', this.formCatalogo.prezzoBase || 'Su preventivo');
    
    if (this.fileDaCaricare) {
      formData.append('immagine', this.fileDaCaricare);
    }

    if (this.modalMode === 'crea') {
      this.catalogoService.creaVoce(formData).subscribe({
        next: () => {
          this.resetFile();
          this.caricaCatalogo();
          this.chiudiModale();
        },
        error: (err) => console.error('Errore creazione:', err)
      });
    } else {
      // ORA PASSIAMO formData ANCHE NELLA MODIFICA
      if (this.formCatalogo.id) {
        this.catalogoService.modificaVoce(this.formCatalogo.id, formData).subscribe({
          next: () => {
            this.resetFile();
            this.caricaCatalogo();
            this.chiudiModale();
          },
          error: (err) => console.error('Errore modifica:', err)
        });
      }
    }
  }

  resetFile() {
    this.fileDaCaricare = null;
    this.nomeFileSelezionato = '';
  }

  async eliminaVoceCatalogo(id: number | undefined) {
    if (!id) return;
    
    const alert = await this.alertController.create({
      cssClass: 'custom-dark-alert', 
      header: 'Eliminare voce?',
      message: 'Sei sicuro di voler eliminare questa voce dal catalogo?',
      buttons: [
        { text: 'Annulla', role: 'cancel', cssClass: 'dark-alert-btn-cancel' },
        {
          text: 'Elimina',
          role: 'destructive',
          cssClass: 'dark-alert-btn-danger',
          handler: () => {
            // CHIAMATA DELETE
            this.catalogoService.eliminaVoce(id).subscribe({
              next: () => {
                this.caricaCatalogo(); 
              },
              error: (err) => console.error('Errore eliminazione voce catalogo:', err)
            });
          }
        }
      ]
    });
    await alert.present();
  }
  // Helper per visualizzare le immagini nella lista
  getImmagineUrl(immagine?: string): string {
    const placeholder = 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=200&auto=format&fit=crop';
    
    if (!immagine) return placeholder;
    if (immagine.startsWith('http') || immagine.startsWith('blob:')) return immagine;
    
    return 'http://localhost:3000' + immagine;
  }

}
