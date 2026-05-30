import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';

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
  IonCardContent
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';

import { arrowBackOutline, documentAttachOutline, trashOutline } from 'ionicons/icons';

@Component({
  selector: 'app-preventivi',
  templateUrl: './preventivi.page.html',
  styleUrls: ['./preventivi.page.scss'],
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
    IonCardContent
  ]
})
export class PreventiviPage {

  descrizione: string = '';

  servizio: string = '';

  materiale: string = '';

  dimensioni: string = '';

  finitura: string = '';

  allegatiNomi: string[] = [];

  preventivoInviato: boolean = false;
  isMac: boolean = false;

  get formValido(): boolean {

  return (
    this.descrizione.trim() !== '' &&
    this.servizio.trim() !== '' &&
    this.materiale.trim() !== '' &&
    this.dimensioni.trim() !== ''
  );

}

 constructor(private router: Router) {
  addIcons({
    arrowBackOutline,
    documentAttachOutline,
    trashOutline
  });

this.isMac = navigator.userAgent.toLowerCase().includes('mac');
  }

selezionaFile(event: Event) {
    const input = event.target as HTMLInputElement;
    this.allegatiNomi = []; // Svuota la lista precedente se l'utente fa una nuova selezione

    if (input.files && input.files.length > 0) {
      for (let i = 0; i < input.files.length; i++) {
        this.allegatiNomi.push(input.files[i].name);
      }
    }
  }

  svuotaAllegati() {
    this.allegatiNomi = [];
  }

inviaPreventivo() {
    console.log({
      descrizione: this.descrizione,
      servizio: this.servizio,
      materiale: this.materiale,
      dimensioni: this.dimensioni,
      finitura: this.finitura,
      allegati: this.allegatiNomi // <--- Ora inviamo un array!
    });

    this.preventivoInviato = true;

    setTimeout(() => {
      this.router.navigate(['/dashboard-cliente']);
    }, 5);
  }
  
}
