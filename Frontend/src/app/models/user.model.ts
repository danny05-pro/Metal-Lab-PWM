export type RuoloUtente =
  | 'cliente'
  | 'admin'
  | 'dipendente';

export interface User {
  id: number;
  nome: string;
  cognome: string;
  telefono: string | null;
  email: string;
  ruolo: RuoloUtente;
}

export interface Dipendente extends User {
  ruolo: 'dipendente';
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  nome: string;
  cognome: string;
  telefono: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: User;
}

export interface RegisterResponse {
  message: string;
  user: User;
}

export type AuthResponse = LoginResponse | RegisterResponse;

export interface DipendenteRequest {
  nome: string;
  cognome: string;
  telefono: string;
  email: string;
  password?: string;
}
