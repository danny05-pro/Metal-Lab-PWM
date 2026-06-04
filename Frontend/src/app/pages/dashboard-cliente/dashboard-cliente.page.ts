import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardContent,
  IonCardHeader, IonCardTitle, IonGrid, IonRow, IonCol, IonChip, IonButton,
  IonButtons, IonIcon, IonLabel
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import { 
  arrowBackOutline, documentTextOutline, constructOutline,
  checkmarkDoneOutline, closeCircleOutline, trashOutline, alertCircleOutline, 
  calendarNumberOutline, timeOutline, personAddOutline, calendarOutline, 
  buildOutline, helpCircleOutline
} from 'ionicons/icons';

import { Preventivo } from 'src/app/models/preventivo.model';
import { InterventiService } from '../../services/interventi.service';
import { PreventiviService } from '../../services/preventivi.service';

@Component({
  selector: 'app-dashboard-cliente',
  templateUrl: './dashboard-cliente.page.html',
  styleUrls: ['./dashboard-cliente.page.scss'],
  standalone: true,
  imports: [
    CommonModule, RouterLink, IonContent, IonHeader, IonTitle, IonToolbar,
    IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonGrid, IonRow,
    IonCol, IonChip, IonButton, IonButtons, IonIcon, IonLabel
  ]
})
export class DashboardClientePage { 

  tuttiGliInterventi: any[] = [];
  interventiFuturi: any[] = [];
  preventivi: Preventivo[] = [];
  nomeCliente = '';

  constructor(
    private interventiService: InterventiService,
    private preventiviService: PreventiviService,
  ) {
    addIcons({ 
      arrowBackOutline, documentTextOutline, constructOutline,
      checkmarkDoneOutline, closeCircleOutline, trashOutline, alertCircleOutline, 
      calendarNumberOutline, timeOutline, personAddOutline, calendarOutline, 
      buildOutline, helpCircleOutline
    });
  }

  ionViewWillEnter() {
    this.nomeCliente = sessionStorage.getItem('nomeUtente') || 'Cliente';
    this.caricaInterventi();
    this.caricaPreventivi(); 
  }

  // ==========================================
  // GESTIONE INTERVENTI E CALENDARIO
  // ==========================================
  caricaInterventi() {
    this.interventiService.getInterventiCliente().subscribe({
      next: (dati) => {
        // 1. Ordinamento con priorità Cliente (Lista principale)
        this.tuttiGliInterventi = dati.sort((a, b) => {
          const pesoA = this.calcolaPesoIntervento(a);
          const pesoB = this.calcolaPesoIntervento(b);
          
          if (pesoA !== pesoB) return pesoA - pesoB;
          return (b.id || 0) - (a.id || 0);
        });

        // 2. LOGICA CALENDARIO: Assegnati, In Lavorazione, Terminati da < 24h
        const oraAttuale = new Date().getTime();
        const ventiquattroOreFa = oraAttuale - (24 * 60 * 60 * 1000); 
        
        let filtratiCalendario = dati.filter(intervento => {
          const dataDaUsare = intervento.data_accettata || intervento.data_proposta_admin || intervento.data_proposta_cliente || intervento.data_richiesta;
          if (!dataDaUsare) return false;
          
          const timestampEvento = new Date(dataDaUsare).getTime();

          // Condizione A: Assegnato al tecnico (Programmato + almeno 1 dipendente)
          const isAssegnato = intervento.stato_lavorazione === 'Programmato' && (intervento.numero_dipendenti && intervento.numero_dipendenti > 0);
          
          // Condizione B: Tecnico fisicamente a lavoro
          const isInLavorazione = intervento.stato_lavorazione === 'In lavorazione';
          
          // Condizione C: Lavoro completato da meno di 24 ore
          const isTerminatoRecente = intervento.stato_lavorazione === 'Terminato' && timestampEvento >= ventiquattroOreFa;

          return isAssegnato || isInLavorazione || isTerminatoRecente;
        });

        // 3. ORDINAMENTO CALENDARIO: Ordine cronologico (Dal più vicino al più lontano)
        this.interventiFuturi = filtratiCalendario.sort((a, b) => {
          const dataStringA = a.data_accettata || a.data_proposta_admin || a.data_proposta_cliente || a.data_richiesta || '';
          const dataStringB = b.data_accettata || b.data_proposta_admin || b.data_proposta_cliente || b.data_richiesta || '';
          
          const tempoA = new Date(dataStringA).getTime();
          const tempoB = new Date(dataStringB).getTime();
          
          return tempoA - tempoB; 
        });
      },
      error: (err) => console.error('Errore caricamento interventi', err)
    });
  }

  calcolaPesoIntervento(intervento: any): number {
    // 3. In fondo: Pratiche chiuse o rifiutate
    if (
      intervento.stato_admin === 'Rifiutato' || 
      intervento.stato_risposta_cliente === 'Intervento annullato' ||
      intervento.stato_lavorazione === 'Terminato'
    ) return 3; 

    // 1. In cima: Il cliente deve confermare la data proposta dall'admin
    if (intervento.stato_admin === 'Data proposta' && intervento.stato_risposta_cliente === 'In attesa') return 1; 

    // 2. In mezzo: Il cliente aspetta (in valutazione, assegnazione tecnico, in lavorazione)
    return 2;
  }

  // ==========================================
  // GESTIONE PREVENTIVI
  // ==========================================
  caricaPreventivi() {
    this.preventiviService.getPreventivi().subscribe({
      next: (dati) => {
        // Ordinamento con priorità Cliente
        this.preventivi = dati.sort((a, b) => {
          const pesoA = this.calcolaPesoPreventivo(a);
          const pesoB = this.calcolaPesoPreventivo(b);
          
          if (pesoA !== pesoB) return pesoA - pesoB;
          return (b.id || 0) - (a.id || 0); // Dal più recente
        });
      },
      error: (err) => console.error('Errore caricamento preventivi:', err)
    });
  }

  calcolaPesoPreventivo(p: any): number {
    const statoAdmin = p.stato_admin;
    const statoCliente = p.stato_risposta_cliente;

    // 3. In fondo: Chiusi/Rifiutati
    if (statoAdmin === 'Rifiutato' || statoCliente === 'Rifiutato') return 3; 
    
    // 1. In cima: L'officina ha mandato il prezzo, il cliente deve rispondere
    if (statoAdmin === 'Prezzo proposto' && statoCliente === 'In attesa') return 1;
    
    // 2. In mezzo: Lavori accettati o in attesa di prezzatura
    return 2;
  }

  // ==========================================
  // HELPER UX: TRADUZIONE STATI
  // ==========================================
  getStatoPreventivoUX(preventivo: any): { label: string, color: string, icon: string } {
    const statoAdmin = preventivo.stato_admin;
    const statoCliente = preventivo.stato_risposta_cliente;

    if (statoAdmin === 'Rifiutato' || statoCliente === 'Rifiutato') return { label: 'Rifiutato', color: 'danger', icon: 'close-circle-outline' };
    if (statoCliente === 'Accettato' || statoAdmin === 'Preventivo concordato') return { label: 'Accettato', color: 'success', icon: 'checkmark-done-outline' };
    if (statoAdmin === 'Da valutare') return { label: 'In valutazione', color: 'medium', icon: 'time-outline' };
    if (statoAdmin === 'Prezzo proposto' && statoCliente === 'In attesa') return { label: 'Risposta Richiesta', color: 'warning', icon: 'alert-circle-outline' };

    return { label: statoAdmin, color: 'medium', icon: 'help-circle-outline' };
  }

  getStatoInterventoUX(intervento: any): { label: string, color: string, icon: string } {
    if (intervento.stato_lavorazione === 'Terminato') return { label: 'Completato', color: 'success', icon: 'checkmark-done-outline' };
    if (intervento.stato_admin === 'Rifiutato') return { label: 'Rifiutato', color: 'danger', icon: 'close-circle-outline' };
    if (intervento.stato_risposta_cliente === 'Intervento annullato') return { label: 'Annullato', color: 'danger', icon: 'trash-outline' };

    if (intervento.stato_admin === 'Richiesto') return { label: 'In valutazione', color: 'medium', icon: 'time-outline' };
    if (intervento.stato_admin === 'Data proposta' && intervento.stato_risposta_cliente === 'In attesa') return { label: 'Conferma Data', color: 'warning', icon: 'alert-circle-outline' };
    if (intervento.stato_admin === 'In attesa nuova valutazione') return { label: 'In attesa conferma', color: 'medium', icon: 'time-outline' };
    
    if (intervento.stato_lavorazione === 'Programmato') {
      if (intervento.numero_dipendenti > 0) {
        return { label: 'Assegnato al Tecnico', color: 'primary', icon: 'calendar-outline' };
      } else {
        return { label: 'Ricerca Tecnico in corso', color: 'medium', icon: 'time-outline' }; 
      }
    }

    if (intervento.stato_lavorazione === 'In lavorazione') return { label: 'Tecnico a lavoro', color: 'tertiary', icon: 'build-outline' };

    return { label: 'In lavorazione', color: 'light', icon: 'help-circle-outline' };
  }
}