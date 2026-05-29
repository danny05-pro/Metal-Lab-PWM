import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

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
  arrowBackOutline
} from 'ionicons/icons';

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

  constructor(private router: Router) {
    addIcons({
      arrowBackOutline
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

    sessionStorage.setItem(
      'utenteLoggato',
      'true'
    );

    sessionStorage.setItem(
      'ruoloUtente',
      'cliente'
    );

    this.router.navigate([
      '/home'
    ]);
  }

}