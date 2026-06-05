import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonButton,
  IonButtons,
  IonHeader,
  IonIcon,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackOutline } from 'ionicons/icons';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [
    RouterLink,
    IonButton,
    IonButtons,
    IonHeader,
    IonIcon,
    IonTitle,
    IonToolbar
  ]
})
export class HeaderComponent {
  @Input() title = 'Home';
  @Input() backLink = '/home';
  @Input() showBack = true;
  @Input() variant: 'default' | 'home' = 'default';

  constructor() {
    addIcons({ arrowBackOutline });
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
