//contiene le interfacce delle risposte generiche del backend

export interface ApiMessageResponse {
  message: string;
}

export interface ApiErrorResponse {
  message?: string;
  error?: string;
}
