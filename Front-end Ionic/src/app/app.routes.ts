import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home.page').then(m => m.HomePage)
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register.page').then(m => m.RegisterPage)
  },
  {
    path: 'catalogo',
    loadComponent: () =>
      import('./pages/catalogo/catalogo.page').then(m => m.CatalogoPage)
  },
  {
    path: 'preventivi',
    loadComponent: () =>
      import('./pages/preventivi/preventivi.page').then(m => m.PreventiviPage)
  },
  {
    path: 'dashboard-cliente',
    loadComponent: () =>
      import('./pages/dashboard-cliente/dashboard-cliente.page')
    .then(m => m.DashboardClientePage)
  },
  {
    path: 'dashboard-dipendente',
    loadComponent: () =>
      import('./pages/dashboard-dipendente/dashboard-dipendente.page')
    .then(m => m.DashboardDipendentePage)
  },
  {
    path: 'dashboard-admin',
    loadComponent: () =>
      import('./pages/dashboard-admin/dashboard-admin.page')
    .then(m => m.DashboardAdminPage)
  },
  {
    path: 'interventi',
    loadComponent: () => import('./pages/interventi/interventi.page')
    .then( m => m.InterventiPage)
  },
 {
  path: 'dettaglio-preventivo-admin/:id',
  loadComponent: () =>
    import('./pages/dettaglio-preventivo-admin/dettaglio-preventivo-admin.page')
      .then(m => m.DettaglioPreventivoAdminPage)
},
  
  {
    path: 'gestione-dipendenti',
    loadComponent: () => import('./pages/gestione-dipendenti/gestione-dipendenti.page')
    .then( m => m.GestioneDipendentiPage)
  },
  {
  path: 'dettaglio-preventivo-cliente/:id',
  loadComponent: () =>
    import('./pages/dettaglio-preventivo-cliente/dettaglio-preventivo-cliente.page')
      .then(m => m.DettaglioPreventivoClientePage)
},
{
  path: 'dettaglio-intervento-cliente/:id',
  loadComponent: () =>
    import('./pages/dettaglio-intervento-cliente/dettaglio-intervento-cliente.page')
      .then(m => m.DettaglioInterventoClientePage)
},
{
  path: 'dettaglio-intervento-admin/:id',
  loadComponent: () =>
    import('./pages/dettaglio-intervento-admin/dettaglio-intervento-admin.page')
      .then(m => m.DettaglioInterventoAdminPage)
},
{
  path: 'dettaglio-intervento-dipendente/:id',
  loadComponent: () =>
    import('./pages/dettaglio-intervento-dipendente/dettaglio-intervento-dipendente.page')
      .then(m => m.DettaglioInterventoDipendentePage)
},
  {
    path: '**',
    redirectTo: 'home'
  }


];