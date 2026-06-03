import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Necessario per @if, @for
import { ActivatedRoute, Router, RouterLink } from '@angular/router'; // CORRETTO: import da @angular/router

import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonButton,
  IonIcon, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonChip
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import { arrowBackOutline } from 'ionicons/icons';
import { Preventivo } from '../../models/preventivo.model';

@Component({
  selector: 'app-dettaglio-preventivo-cliente',
  templateUrl: './dettaglio-preventivo-cliente.page.html',
  styleUrls: ['./dettaglio-preventivo-cliente.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonButton,
    IonIcon,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonChip
  ]
})
export class DettaglioPreventivoClientePage implements OnInit {

  preventivoId = '';
  preventivo: Preventivo | null = null; 

  constructor(
    private route: ActivatedRoute, 
    private router: Router
  ) {
    addIcons({ arrowBackOutline });
    this.preventivoId = this.route.snapshot.paramMap.get('id') || '';
  }

  ngOnInit() {
    // Qui in futuro caricherai i dati reali.
    // Per ora, se vuoi vedere la pagina renderizzata, 
    // potresti inizializzare preventivo con dati mock.
  }

  accettaPreventivo() {
    if (!this.preventivo) return;
    this.preventivo.stato_risposta_cliente = 'Accettato';
    this.router.navigate(['/dashboard-cliente']);
  }

  rifiutaPreventivo() {
    if (!this.preventivo) return;
    this.preventivo.stato_risposta_cliente = 'Rifiutato';
    this.router.navigate(['/dashboard-cliente']);
  }
}