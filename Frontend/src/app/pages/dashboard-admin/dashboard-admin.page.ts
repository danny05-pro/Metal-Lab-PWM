import { Component } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { AlertController } from '@ionic/angular';

import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardContent,
  IonCardHeader, IonCardTitle, IonGrid, IonRow, IonCol, IonChip, IonButton,
  IonButtons, IonIcon, IonModal, IonItem, IonInput, IonSelect, IonSelectOption, IonFooter, IonLabel
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import { 
  arrowBackOutline, createOutline, addOutline, peopleOutline, saveOutline, 
  trashOutline, closeOutline, cameraOutline, checkmarkDoneOutline, 
  closeCircleOutline, alertCircleOutline, calendarNumberOutline, 
  timeOutline, personAddOutline, calendarOutline, buildOutline, helpCircleOutline 
} from 'ionicons/icons';

import { Intervento } from 'src/app/models/intervento.model';
import { Preventivo } from 'src/app/models/preventivo.model';
import { InterventiService } from 'src/app/services/interventi.service';
import { PreventiviService } from 'src/app/services/preventivi.service';
import { CatalogoService, VoceCatalogo } from 'src/app/services/catalogo.service';
import { CatalogoRequest } from 'src/app/models/catalogo.model';
import { HeaderComponent } from 'src/app/components/header/header.component';

type CatalogoForm = Partial<VoceCatalogo> & Partial<CatalogoRequest>;

@Component({
  selector: 'app-dashboard-admin',
  templateUrl: './dashboard-admin.page.html',
  styleUrls: ['./dashboard-admin.page.scss'],
  standalone: true,
  imports: [
    HeaderComponent,
    CommonModule, RouterLink, FormsModule, IonContent, IonHeader, IonTitle,
    IonToolbar, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonGrid,
    IonRow, IonCol, IonChip, IonButton, IonButtons, IonIcon, IonModal, IonItem,
    IonInput, IonSelect, IonSelectOption, IonFooter, IonLabel
  ]
})
export class DashboardAdminPage {

  totalePreventivi = 0;
  interventiAperti = 0;
  vociCatalogo = 0; 

  interventi: Intervento[] = [];
  preventivi: Preventivo[] = [];
  catalogo: VoceCatalogo[] = [];

  isModalOpen = false;
  modalMode: 'crea' | 'modifica' = 'crea';
  formCatalogo: CatalogoForm = {};
  
  get prodottiCatalogo(): VoceCatalogo[] {
    return this.catalogo.filter(v => v.categoria === 'Prodotto');
  }

  get serviziCatalogo(): VoceCatalogo[] {
    return this.catalogo.filter(v => v.categoria === 'Servizio');
  }


  constructor(
    private alertController: AlertController,
    private interventiService: InterventiService,
    private preventiviService: PreventiviService,
    private catalogoService: CatalogoService
  ) {
    addIcons({
      arrowBackOutline, createOutline, addOutline, peopleOutline, saveOutline, 
      trashOutline, closeOutline, cameraOutline, checkmarkDoneOutline, 
      closeCircleOutline, alertCircleOutline, calendarNumberOutline, 
      timeOutline, personAddOutline, calendarOutline, buildOutline, helpCircleOutline
    });
  }

  ionViewWillEnter() {
    this.caricaInterventiAdmin();
    this.caricaPreventiviAdmin();
    this.caricaCatalogo(); 
  }

  // ==========================================
  // GESTIONE INTERVENTI
  // ==========================================
  caricaInterventiAdmin() {
    this.interventiService.getInterventiAdmin().subscribe({
      next: (datiReali) => {
        this.interventi = datiReali.sort((a, b) => {
          const pesoA = this.calcolaPesoIntervento(a);
          const pesoB = this.calcolaPesoIntervento(b);
          
          if (pesoA !== pesoB) return pesoA - pesoB;
          return (b.id || 0) - (a.id || 0);
        });

        this.interventiAperti = datiReali.filter(
          intervento =>
            intervento.stato_admin !== 'Rifiutato' &&
            intervento.stato_risposta_cliente !== 'Intervento annullato' &&
            intervento.stato_lavorazione !== 'Terminato'
        ).length;
      },
      error: (err) => console.error('Errore caricamento interventi admin:', err)
    });
  }

  calcolaPesoIntervento(intervento: Intervento): number {
    // 4. In fondo: Pratiche chiuse
    if (
      intervento.stato_admin === 'Rifiutato' || 
      intervento.stato_risposta_cliente === 'Intervento annullato' ||
      intervento.stato_lavorazione === 'Terminato'
    ) return 4; 
    
    // 1. In cima: L'admin deve agire (Valutare, Rispondere o Assegnare Tecnico)
    if (
      intervento.stato_admin === 'Richiesto' || 
      intervento.stato_admin === 'In attesa nuova valutazione' ||
      (intervento.stato_lavorazione === 'Programmato' && (!intervento.numero_dipendenti || intervento.numero_dipendenti === 0))
    ) return 1; 

    // 2. L'admin aspetta la risposta del cliente
    if (intervento.stato_admin === 'Data proposta') return 2;

    // 3. Pratica in corso (Già assegnata ai tecnici o in lavorazione)
    return 3;
  }

  getStatoInterventoUX(intervento: Intervento): { label: string, color: string, icon: string } {
    if (intervento.stato_lavorazione === 'Terminato') return { label: 'Completato', color: 'success', icon: 'checkmark-done-outline' };
    if (intervento.stato_admin === 'Rifiutato') return { label: 'Rifiutato', color: 'danger', icon: 'close-circle-outline' };
    if (intervento.stato_risposta_cliente === 'Intervento annullato') return { label: 'Annullato dal Cliente', color: 'danger', icon: 'trash-outline' };

    if (intervento.stato_admin === 'Richiesto') return { label: 'Da Valutare', color: 'warning', icon: 'alert-circle-outline' };
    if (intervento.stato_admin === 'In attesa nuova valutazione') return { label: 'Valuta Nuova Data', color: 'warning', icon: 'calendar-number-outline' };

    if (intervento.stato_admin === 'Data proposta') return { label: 'In attesa del Cliente', color: 'medium', icon: 'time-outline' };

    if (intervento.stato_lavorazione === 'Programmato') {
      if ((intervento.numero_dipendenti ?? 0) > 0) {
        return { label: 'Assegnato al Tecnico', color: 'primary', icon: 'calendar-outline' };
      } else {
        return { label: 'Assegna Tecnico', color: 'warning', icon: 'person-add-outline' };
      }
    }

    if (intervento.stato_lavorazione === 'In lavorazione') return { label: 'Tecnico a lavoro', color: 'tertiary', icon: 'build-outline' };

    return { label: 'Sconosciuto', color: 'light', icon: 'help-circle-outline' };
  }

  // ==========================================
  // GESTIONE PREVENTIVI
  // ==========================================
  caricaPreventiviAdmin() {
    this.preventiviService.getPreventiviAdmin().subscribe({
      next: (datiReali) => {
        this.preventivi = datiReali.sort((a, b) => {
          const pesoA = this.calcolaPesoPreventivo(a);
          const pesoB = this.calcolaPesoPreventivo(b);
          
          if (pesoA !== pesoB) return pesoA - pesoB;
          return (b.id || 0) - (a.id || 0);
        });
        
        this.totalePreventivi = datiReali.filter(p => p.stato_admin === 'Da valutare').length;
      },
      error: (err) => console.error('Errore caricamento preventivi admin:', err)
    });
  }

  calcolaPesoPreventivo(p: Preventivo): number {
    const statoAdmin = p.stato_admin;
    const statoCliente = p.stato_risposta_cliente;

    // 4. In fondo: Pratiche chiuse/rifiutate
    if (statoAdmin === 'Rifiutato' || statoCliente === 'Rifiutato') return 4; 
    // 3. Lavoro acquisito
    if (statoCliente === 'Accettato' || statoAdmin === 'Preventivo concordato') return 3; 
    // 2. L'admin aspetta la decisione del cliente
    if (statoAdmin === 'Prezzo proposto' && statoCliente === 'In attesa') return 2;
    // 1. In cima: L'admin deve valutare la richiesta
    if (statoAdmin === 'Da valutare') return 1;

    return 2;
  }

  getStatoPreventivoUX(preventivo: Preventivo): { label: string, color: string, icon: string } {
    const statoAdmin = preventivo.stato_admin;
    const statoCliente = preventivo.stato_risposta_cliente;

    if (statoAdmin === 'Rifiutato' || statoCliente === 'Rifiutato') return { label: 'Rifiutato', color: 'danger', icon: 'close-circle-outline' };
    if (statoCliente === 'Accettato' || statoAdmin === 'Preventivo concordato') return { label: 'Accettato', color: 'success', icon: 'checkmark-done-outline' };
    if (statoAdmin === 'Da valutare') return { label: 'Da valutare', color: 'warning', icon: 'alert-circle-outline' };
    if (statoAdmin === 'Prezzo proposto' && statoCliente === 'In attesa') return { label: 'In attesa del cliente', color: 'medium', icon: 'time-outline' };

    return { label: statoAdmin, color: 'medium', icon: 'help-circle-outline' };
  }

  // ==========================================
  // GESTIONE CATALOGO
  // ==========================================
  caricaCatalogo() {
    this.catalogoService.getCatalogo().subscribe({
      next: (dati) => {
        this.catalogo = dati;
        this.vociCatalogo = this.catalogo.length;
      },
      error: (err: HttpErrorResponse) => console.error('Errore caricamento catalogo:', err)
    });
  }

  aggiungiVoceCatalogo() {
    this.modalMode = 'crea';
    this.formCatalogo = { categoria: 'Prodotto' };
    this.isModalOpen = true;
  }

  modificaVoceCatalogo(id: number | undefined) {
    if (!id) return;
    const voce = this.catalogo.find(v => v.id === id);
    if (voce) {
      this.modalMode = 'modifica';
      this.formCatalogo = { ...voce, prezzoBase: voce.prezzo_base };
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

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this.fileDaCaricare = file;
      this.nomeFileSelezionato = file.name;
      this.formCatalogo.immagine = URL.createObjectURL(file);
    }
  }

  salvaVoceCatalogo() {
    if (!this.formCatalogoValido) return;

    const formData = new FormData();
    formData.append('nome', this.formCatalogo.nome!);
    formData.append('categoria', this.formCatalogo.categoria!);
    formData.append('prezzoBase', this.formCatalogo.prezzoBase || this.formCatalogo.prezzo_base || 'Su preventivo');
    
    if (this.fileDaCaricare) {
      formData.append('immagine', this.fileDaCaricare);
    } else if (this.formCatalogo.immagine) {
      formData.append('immagine', this.formCatalogo.immagine);
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

  getImmagineUrl(immagine?: string | null): string {
    const placeholder = 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=200&auto=format&fit=crop';
    if (!immagine) return placeholder;
    if (immagine.startsWith('http') || immagine.startsWith('blob:')) return immagine;
    return 'http://localhost:3000' + immagine;
  }
}
