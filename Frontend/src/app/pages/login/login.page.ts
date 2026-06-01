import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  ActivatedRoute,
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
  IonCard,
  IonCardContent,
  IonItem,
  IonLabel,
  IonInput,
  IonText,
  IonInputPasswordToggle
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import {
  arrowBackOutline,
  alertCircleOutline
} from 'ionicons/icons';

// 1. Importiamo il Service di Autenticazione
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
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
    IonCard,
    IonCardContent,
    IonItem,
    IonLabel,
    IonInput,
    IonText,
    IonInputPasswordToggle
  ]
})
export class LoginPage {

  modalita: 'login' | 'register' = 'login';
  email = '';
  password = '';
  returnUrl = '/home';
  
  erroreLogin = ''; 

  // 2. Iniettiamo l'AuthService invece di HttpClient
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService 
  ) {
    addIcons({
      arrowBackOutline,
      alertCircleOutline
    });

    this.returnUrl =
      this.route.snapshot.queryParamMap.get('returnUrl')
      || '/home';
  }
  
  accedi() {
    if (!this.loginValido) {
      return;
    }

    this.erroreLogin = ''; 

    const body = {
      email: this.email,
      password: this.password
    };

    // 3. Usiamo il service per fare la chiamata
    this.authService.login(body).subscribe({
      next: (response: any) => {
        console.log('Login riuscito:', response);

        if (response.token) {
          sessionStorage.setItem('token', response.token);
        }
        
        sessionStorage.setItem('utenteLoggato', 'true');
        
        // Estraiamo il ruolo (supporta sia che dal server arrivi come 'user' o come 'utente')
        const ruolo = response.utente?.ruolo || response.user?.ruolo || '';
        sessionStorage.setItem('ruoloUtente', ruolo);

        this.router.navigate([this.returnUrl]);
      },
      error: (err: any) => {
        console.error('Errore login:', err);
        
        if (err.status === 401 || err.status === 400) {
          this.erroreLogin = err.error.message;
        } else {
          this.erroreLogin = 'Errore di connessione al server.';
        }
      }
    });
  }
  
  get loginValido(): boolean {
    return (
      this.email.trim() !== '' &&
      this.password.trim() !== ''
    );
  }
}