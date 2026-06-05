import { Component } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import {
  IonContent,
  IonButton,
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
import { arrowBackOutline, alertCircleOutline } from 'ionicons/icons';

// IMPORT CORRETTO E SICURO
import { AuthService } from 'src/app/services/auth.service';
import { LoginResponse } from 'src/app/models/user.model';
import { getHttpErrorMessage } from 'src/app/utils/http-error.util';
import { HeaderComponent } from '../../components/header/header.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    HeaderComponent,
    FormsModule,
    RouterLink,
    IonContent,
    IonButton,
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

  email = '';
  password = '';
  returnUrl = '/home';
  erroreLogin = ''; 

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService 
  ) {
    addIcons({
      arrowBackOutline,
      alertCircleOutline
    });

    this.returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/home';
  }
  
  accedi() {
    if (!this.loginValido) return;

    this.erroreLogin = ''; 

    const body = {
      email: this.email,
      password: this.password
    };

    this.authService.login(body).subscribe({
      next: (response: LoginResponse) => {
        console.log('Login riuscito:', response);

        if (response.token) {
          sessionStorage.setItem('token', response.token);
        }
        
        sessionStorage.setItem('utenteLoggato', 'true');
        
        // Salviamo tutti i dati dell'utente nel SessionStorage
        sessionStorage.setItem('ruoloUtente', response.user.ruolo);
        sessionStorage.setItem('nomeUtente', response.user.nome);

        // Ora torniamo alla home, dove la logica dei bottoni farà il resto
        this.router.navigate(['/home']);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Errore login:', err);
        
        if (err.status === 401 || err.status === 400) {
          this.erroreLogin = getHttpErrorMessage(err, 'Credenziali non valide.');
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
