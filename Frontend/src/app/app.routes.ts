import { Routes } from '@angular/router';

// 1. IMPORTIAMO I LUCCHETTI (GUARDS)
import { adminGuard } from './guards/admin-guard';
import { clienteGuard } from './guards/cliente-guard';
import { dipendenteGuard } from './guards/dipendente-guard';

export const routes: Routes = [
  // ==========================================
  // ROTTE PUBBLICHE (Nessun lucchetto)
  // ==========================================
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then(m => m.HomePage)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.page').then(m => m.RegisterPage)
  },
  {
    path: 'catalogo',
    loadComponent: () => import('./pages/catalogo/catalogo.page').then(m => m.CatalogoPage)
  },

  // ==========================================
  // AREA CLIENTE (Lucchetto: clienteGuard)
  // ==========================================
  {
    path: 'dashboard-cliente',
    loadComponent: () => import('./pages/dashboard-cliente/dashboard-cliente.page').then(m => m.DashboardClientePage),
    canActivate: [clienteGuard]
  },
  {
    path: 'preventivi',
    loadComponent: () => import('./pages/preventivi/preventivi.page').then(m => m.PreventiviPage),
    canActivate: [clienteGuard]
  },
  {
    path: 'interventi',
    loadComponent: () => import('./pages/interventi/interventi.page').then( m => m.InterventiPage),
    canActivate: [clienteGuard]
  },
  {
    path: 'dettaglio-preventivo-cliente/:id',
    loadComponent: () => import('./pages/dettaglio-preventivo-cliente/dettaglio-preventivo-cliente.page').then(m => m.DettaglioPreventivoClientePage),
    canActivate: [clienteGuard]
  },
  {
    path: 'dettaglio-intervento-cliente/:id',
    loadComponent: () => import('./pages/dettaglio-intervento-cliente/dettaglio-intervento-cliente.page').then(m => m.DettaglioInterventoClientePage),
    canActivate: [clienteGuard]
  },

  // ==========================================
  // AREA ADMIN (Lucchetto: adminGuard)
  // ==========================================
  {
    path: 'dashboard-admin',
    loadComponent: () => import('./pages/dashboard-admin/dashboard-admin.page').then(m => m.DashboardAdminPage),
    canActivate: [adminGuard]
  },
  {
    path: 'gestione-dipendenti',
    loadComponent: () => import('./pages/gestione-dipendenti/gestione-dipendenti.page').then( m => m.GestioneDipendentiPage),
    canActivate: [adminGuard]
  },
  {
    path: 'dettaglio-preventivo-admin/:id',
    loadComponent: () => import('./pages/dettaglio-preventivo-admin/dettaglio-preventivo-admin.page').then(m => m.DettaglioPreventivoAdminPage),
    canActivate: [adminGuard]
  },
  {
    path: 'dettaglio-intervento-admin/:id',
    loadComponent: () => import('./pages/dettaglio-intervento-admin/dettaglio-intervento-admin.page').then(m => m.DettaglioInterventoAdminPage),
    canActivate: [adminGuard]
  },

  // ==========================================
  // AREA DIPENDENTE (Lucchetto: dipendenteGuard)
  // ==========================================
  {
    path: 'dashboard-dipendente',
    loadComponent: () => import('./pages/dashboard-dipendente/dashboard-dipendente.page').then(m => m.DashboardDipendentePage),
    canActivate: [dipendenteGuard]
  },
  {
    path: 'dettaglio-intervento-dipendente/:id',
    loadComponent: () => import('./pages/dettaglio-intervento-dipendente/dettaglio-intervento-dipendente.page').then(m => m.DettaglioInterventoDipendentePage),
    canActivate: [dipendenteGuard]
  },

  // ==========================================
  // FALLBACK (Pagina non trovata)
  // ==========================================
  {
    path: '**',
    redirectTo: 'home'
  }
];