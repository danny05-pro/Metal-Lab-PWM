import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const clienteGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  const ruolo = sessionStorage.getItem('ruoloUtente');
  const token = sessionStorage.getItem('token'); 
  
  if (ruolo === 'cliente' && token) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};