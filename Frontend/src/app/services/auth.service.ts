import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginData, LoginResponse, RegisterData, RegisterResponse } from '../models/user.model';

export type {
  AuthResponse,
  LoginData,
  LoginResponse,
  RegisterData,
  RegisterResponse
} from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = '/auth';

  constructor(private http: HttpClient) {}

  // CHIAMATE HTTP

  login(dati: LoginData): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, dati);
  }

  register(dati: RegisterData): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, dati);
  }
}
