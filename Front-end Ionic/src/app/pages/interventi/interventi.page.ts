import { Component } from '@angular/core';

import { FormsModule } from '@angular/forms';

import {
  Router,
  RouterLink
} from '@angular/router';

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
  warningOutline,
  constructOutline
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
    IonCardContent
  ]
})
export class InterventiPage {

  descrizione = '';

  luogo = '';

  priorita = '';

  dataIntervento = '';

  interventoInviato = false;

  constructor(
    private router: Router
  ) {

    addIcons({
      arrowBackOutline,
      warningOutline,
      constructOutline
    });

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
