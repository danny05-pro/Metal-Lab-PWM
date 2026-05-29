import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';

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
import { arrowBackOutline, alertCircleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
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
export class RegisterPage {

  nome = '';
  cognome = '';
  telefono = '';
  email = '';
  password = '';

  erroreRegistrazione = '';

  constructor(private router: Router, private http: HttpClient) {
    addIcons({
      arrowBackOutline,
      alertCircleOutline
    });
  }

  // Funzione che blocca le lettere in tempo reale
  filtraNumeri(event: any) {
    const valore = event.target.value;
    
    // Rimuove qualsiasi carattere che non sia un numero (0-9)
    this.telefono = valore.replace(/\D/g, '');
    
    // Forza l'aggiornamento grafico dell'input
    event.target.value = this.telefono;
  }

  emailValida(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }



  telefonoValido(telefono: string): boolean {
    const soloCifre = telefono.replace(/\D/g, '');
    return soloCifre.length >= 8;
  }

  // L'UNICO CONTROLLO PASSWORD (Metodo Getter)
  get passwordValida(): boolean {
    const p = this.password;
    
    const haMaiuscola = /[A-Z]/.test(p);
    const haMinuscola = /[a-z]/.test(p);
    const haNumero = /[0-9]/.test(p);
    const haSpeciale = /[\W_]/.test(p); // \W cerca qualsiasi simbolo speciale
    const lungaAbbastanza = p.length >= 6;

    // Ritorna true SOLO se TUTTE le condizioni sono soddisfatte
    return haMaiuscola && haMinuscola && haNumero && haSpeciale && lungaAbbastanza;
  }

  get registrazioneValida(): boolean {
    return (
      this.nome.trim() !== '' &&
      this.cognome.trim() !== '' &&
      this.emailValida(this.email) &&
      this.telefonoValido(this.telefono) &&
      this.passwordValida // <--- Niente più parentesi qui, usiamo il getter!
    );
  }

 registrati() {
    if (!this.registrazioneValida) {
      return;
    }

    this.erroreRegistrazione = '';

    // Prepara il pacchetto dati
    const payload = {
      nome: this.nome,
      cognome: this.cognome,
      telefono: this.telefono,
      email: this.email,
      password: this.password
    };

    // Chiama l'API
    this.http.post('http://localhost:3000/api/auth/register', payload).subscribe({
      next: (response: any) => {
        console.log('Registrato con successo:', response);
        
        // Nel tuo authController.js la registrazione non restituisce un token automatico.
        // Di conseguenza, la prassi standard è reindirizzare l'utente al Login!
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error(err);
        // Cattura gli errori inviati dal backend (es. status 409 o 400)
        if (err.status === 409) {
          this.erroreRegistrazione = 'Questa email è già registrata. Vai al login.';
        } else if (err.error && err.error.message) {
          this.erroreRegistrazione = err.error.message;
        } else {
          this.erroreRegistrazione = 'Errore di connessione al server.';
        }
      }
    });
  }
}