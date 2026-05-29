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

import {
  arrowBackOutline,
  documentAttachOutline
} from 'ionicons/icons';

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

  allegatoNome: string = '';

  preventivoInviato: boolean = false;

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
    documentAttachOutline
  });
}



  selezionaFile(event: Event) {

    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {

      this.allegatoNome = input.files[0].name;

    }

  }

inviaPreventivo() {


  console.log({
    descrizione: this.descrizione,
    servizio: this.servizio,
    materiale: this.materiale,
    dimensioni: this.dimensioni,
    finitura: this.finitura,
    allegato: this.allegatoNome
  });

  this.preventivoInviato = true;

  setTimeout(() => {
    this.router.navigate(['/dashboard-cliente']);
  },5);
}

}
