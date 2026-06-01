import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonButtons,
  IonIcon,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonCard,
  IonCardContent,
  IonDatetime,
  IonModal
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';

import {
  arrowBackOutline,
  warningOutline,
  constructOutline,
  calendarOutline 
} from 'ionicons/icons';

@Component({
  selector: 'app-interventi',
  templateUrl: './interventi.page.html',
  styleUrls: ['./interventi.page.scss'],
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonButtons,
    IonIcon,
    IonItem,
    IonLabel,
    IonInput,
    IonTextarea,
    IonSelect,
    IonSelectOption,
    IonCard,
    IonCardContent,
    IonDatetime,
    IonModal
  ]
})

export class InterventiPage {
  descrizione = '';
  luogo = '';
  priorita = '';
  dataIntervento: string | undefined;
  interventoInviato = false;
  
  dataMinima: string;

  get dataFormattata(): string {
    if (!this.dataIntervento) return '';
    const d = new Date(this.dataIntervento);
    return d.toLocaleDateString('it-IT');
  }

  constructor(private router: Router) {
    addIcons({
      arrowBackOutline,
      warningOutline,
      constructOutline,
      calendarOutline
    });

    const domani = new Date();
    domani.setDate(domani.getDate() + 1); 
    const tzoffset = domani.getTimezoneOffset() * 60000;
    this.dataMinima = (new Date(domani.getTime() - tzoffset)).toISOString().split('T')[0];
  }

  get formValido(): boolean {
    return (
      this.descrizione.trim() !== '' &&
      this.luogo.trim() !== '' &&
      this.priorita.trim() !== '' 
    );
  }

  inviaIntervento() {
    console.log({
      descrizione: this.descrizione,
      luogo: this.luogo,
      priorita: this.priorita,
      dataIntervento: this.dataIntervento
    });

    this.interventoInviato = true;
    setTimeout(() => {
      this.router.navigate(['/dashboard-cliente']);
    }, 5);
  }
}