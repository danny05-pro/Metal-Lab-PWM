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
import { arrowBackOutline, alertCircleOutline } from 'ionicons/icons';

// 1. Importiamo il Service
import { AuthService } from '../../services/auth.service';

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

  // 2. Iniettiamo l'AuthService e rimuoviamo HttpClient
  constructor(
    private router: Router, 
    private authService: AuthService
  ) {
    addIcons({
      arrowBackOutline,
      alertCircleOutline
    });
  }

  filtraNumeri(event: any) {
    const valore = event.target.value;
    this.telefono = valore.replace(/\D/g, '');
    event.target.value = this.telefono;
  }

  // 3. Regex aggiornata: l'indirizzo deve cominciare per forza con una lettera ([a-zA-Z])
  emailValida(email: string): boolean {
    return /^[a-zA-Z][^\s@]*@[^\s@]+\.[^\s@]+$/.test(email);
  }

  telefonoValido(telefono: string): boolean {
    const soloCifre = telefono.replace(/\D/g, '');
    return soloCifre.length >= 8;
  }

  get passwordValida(): boolean {
    const p = this.password;
    
    const haMaiuscola = /[A-Z]/.test(p);
    const haMinuscola = /[a-z]/.test(p);
    const haNumero = /[0-9]/.test(p);
    const haSpeciale = /[\W_]/.test(p); 
    const lungaAbbastanza = p.length >= 6;

    return haMaiuscola && haMinuscola && haNumero && haSpeciale && lungaAbbastanza;
  }

  get registrazioneValida(): boolean {
    return (
      this.nome.trim() !== '' &&
      this.cognome.trim() !== '' &&
      this.emailValida(this.email) &&
      this.telefonoValido(this.telefono) &&
      this.passwordValida 
    );
  }

  registrati() {
    if (!this.registrazioneValida) {
      return;
    }

    this.erroreRegistrazione = '';

    const payload = {
      nome: this.nome,
      cognome: this.cognome,
      telefono: this.telefono,
      email: this.email,
      password: this.password
    };

    // 4. Deleghiamo il lavoro sporco al Service
    this.authService.register(payload).subscribe({
      next: (response: any) => {
        console.log('Registrato con successo:', response);
        this.router.navigate(['/login']);
      },
      error: (err: any) => {
        console.error(err);
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