import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonButtons,
  IonIcon
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';

import {
  hammerOutline,
  constructOutline,
  settingsOutline,
  documentTextOutline,
  calendarOutline,
  clipboardOutline,
  speedometerOutline,
  gitPullRequestOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonButtons,
    IonIcon,
    RouterLink
  ]
})
export class HomePage {
  
  constructor() {
    addIcons({
      hammerOutline,
      constructOutline,
      settingsOutline,
      documentTextOutline,
      calendarOutline,
      clipboardOutline,
      speedometerOutline,
      gitPullRequestOutline
    });
  }

  utenteLoggato(): boolean {
    return sessionStorage.getItem('utenteLoggato') === 'true';
  }

  get ruoloUtente(): string {
    return sessionStorage.getItem('ruoloUtente') || '';
  }

  get dashboardLink(): string {
    if (this.ruoloUtente === 'admin') {
      return '/dashboard-admin';
    }

    if (this.ruoloUtente === 'dipendente') {
      return '/dashboard-dipendente';
    }

    return '/dashboard-cliente';
  }
  
get dashboardLabel(): string {

  if (this.ruoloUtente === 'admin') {
    return 'Dashboard Admin';
  }

  if (this.ruoloUtente === 'dipendente') {
    return 'Dashboard Dipendente';
  }

  return 'Dashboard Cliente';

}

  logout() {
    sessionStorage.removeItem('utenteLoggato');
    sessionStorage.removeItem('ruoloUtente');
  }
}