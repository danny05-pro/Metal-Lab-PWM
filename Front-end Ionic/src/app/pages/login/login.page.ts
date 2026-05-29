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
    IonInput
  ]
})
export class LoginPage {

  modalita: 'login' | 'register' = 'login';

  email = '';

  password = '';

  returnUrl = '/home';

  erroreLogin = 'Credenziali non valide. Riprova.';

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

    this.erroreLogin = ''; // Resetta errori precedenti

    // Prepara i dati da inviare al backend
    const body = {
      email: this.email,
      password: this.password
    };

    // Fai la chiamata POST al tuo server Express
    this.http.post('http://localhost:3000/api/auth/login', body).subscribe({
      next: (response: any) => {
        // IL LOGIN È ANDATO A BUON FINE!
        console.log('Login riuscito:', response);

        // 1. Salva il token crittografato (servirà in futuro per le rotte protette)
        sessionStorage.setItem('token', response.token);
        
        // 2. Aggiorna lo stato della sessione per la nostra app
        sessionStorage.setItem('utenteLoggato', 'true');
        sessionStorage.setItem('ruoloUtente', response.utente.ruolo);

        // 3. Naviga alla home o alla pagina richiesta
        this.router.navigate([this.returnUrl]);
      },
      error: (err) => {
        // Login fallito
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
