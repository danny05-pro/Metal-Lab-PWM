import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ClienteGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const ruolo = sessionStorage.getItem('ruoloUtente');
    const token = sessionStorage.getItem('token');

    if (ruolo === 'cliente' && token) {
      return true;
    }

    this.router.navigate(['/login']);
    return false;
  }
}
