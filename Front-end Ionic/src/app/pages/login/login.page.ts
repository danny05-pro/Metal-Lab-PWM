import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http'; 

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
  IonInputPasswordToggle // <--- Importato correttamente per l'occhio!
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import {
  arrowBackOutline,
  alertCircleOutline
} from 'ionicons/icons';

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
    IonInputPasswordToggle // <--- Inserito nel componente!
  ]
})
export class LoginPage {

  modalita: 'login' | 'register' = 'login';
  email = '';
  password = '';
  returnUrl = '/home';
  
  // Variabile vuota in partenza, così il messaggio d'errore è nascosto
  erroreLogin = ''; 

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient
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

    this.erroreLogin = ''; // Resetta eventuali errori di un tentativo precedente

    const body = {
      email: this.email,
      password: this.password
    };

    // Chiamata al nostro backend!
    this.http.post('http://localhost:3000/api/auth/login', body).subscribe({
      next: (response: any) => {
        console.log('Login riuscito:', response);

        sessionStorage.setItem('token', response.token);
        sessionStorage.setItem('utenteLoggato', 'true');
        sessionStorage.setItem('ruoloUtente', response.user.ruolo);

        this.router.navigate([this.returnUrl]);
      },
      error: (err) => {
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