import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// 1. Tipizziamo i dati in ingresso per il Login
export interface LoginData {
  email: string;
  password: string;
}

// 2. Tipizziamo i dati in ingresso per la Registrazione
export interface RegisterData {
  nome: string;
  cognome: string;
  telefono: string; 
  email: string;
  password: string;
}

// 3. Tipizziamo la risposta che ci aspettiamo dal backend Node.js
export interface AuthResponse {
  message?: string;
  token?: string;
  utente?: {
    id: number;
    nome: string;
    email: string;
    ruolo: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // L'indirizzo base del tuo backend
  private apiUrl = 'http://localhost:3000/api/auth'; 

  // Iniezione di HttpClient per poter fare le chiamate di rete
  constructor(private http: HttpClient) {}

  // ==========================================
  // CHIAMATE HTTP
  // ==========================================

  login(dati: LoginData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, dati);
  }

  register(dati: RegisterData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, dati);
  }
}