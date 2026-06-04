import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonChip,
  IonModal,
  IonDatetime,
  IonItem,
  IonLabel,
  IonInput
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import { arrowBackOutline, calendarOutline } from 'ionicons/icons';

import { Intervento } from 'src/app/models/intervento.model';
import { InterventiService } from 'src/app/services/interventi.service';

@Component({
  selector: 'app-dettaglio-intervento-admin',
  templateUrl: './dettaglio-intervento-admin.page.html',
  styleUrls: ['./dettaglio-intervento-admin.page.scss'],
  standalone: true,
  imports: [
    RouterLink,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonButton,
    IonIcon,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonChip,
    FormsModule,
IonModal,
IonDatetime,
IonItem,
IonLabel,
IonInput
  ]
})
export class DettaglioInterventoAdminPage implements OnInit {

  interventoId = '';

  intervento: Intervento | null = null;

  caricamento = true;

dipendentiDisponibili: any[] = [];

dipendentiAssegnati: any[] = [];

  dataPropostaAdmin = '';

  dataMinima = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private alertController: AlertController,
    private interventiService: InterventiService
  ) {
    addIcons({
      arrowBackOutline, calendarOutline
    });
    const domani = new Date();
domani.setDate(domani.getDate() + 1);

const tzoffset = domani.getTimezoneOffset() * 60000;

this.dataMinima = new Date(
  domani.getTime() - tzoffset
).toISOString().split('T')[0];
  }

  ngOnInit() {
    this.interventoId = this.route.snapshot.paramMap.get('id') || '';

    this.caricaIntervento();
    this.caricaDipendentiDisponibili();
this.caricaDipendentiAssegnati();
  }

  caricaIntervento() {
    this.caricamento = true;

    this.interventiService.getInterventoAdminById(this.interventoId).subscribe({
      next: (intervento) => {
        this.intervento = intervento;
        this.caricamento = false;
      },
      error: (err) => {
        console.error('Errore caricamento dettaglio intervento admin:', err);
        this.caricamento = false;
      }
    });
  }

  caricaDipendentiDisponibili() {
  this.interventiService.getDipendentiDisponibili().subscribe({
    next: (dipendenti) => {
      this.dipendentiDisponibili = dipendenti;
    },
    error: (err) => {
      console.error('Errore caricamento dipendenti:', err);
    }
  });
}

caricaDipendentiAssegnati() {
  this.interventiService.getDipendentiAssegnati(this.interventoId).subscribe({
    next: (dipendenti) => {
      this.dipendentiAssegnati = dipendenti;
    },
    error: (err) => {
      console.error('Errore caricamento dipendenti assegnati:', err);
    }
  });
}

 async assegnaDipendente() {
  if (!this.intervento) {
    return;
  }

  if (this.intervento.stato_admin !== 'Intervento concordato' || this.intervento.stato_lavorazione === 'Terminato') {
      return;
    }
  const alert = await this.alertController.create({
    header: 'Assegna dipendente',
    message: 'Seleziona il dipendente da assegnare a questo intervento.',
    cssClass: 'custom-dark-alert',
    inputs: this.dipendentiDisponibili.map(dipendente => ({
      type: 'radio',
      label: `${dipendente.nome} ${dipendente.cognome}`,
      value: dipendente.id
    })),
    buttons: [
      {
        text: 'Annulla',
        role: 'cancel'
      },
      {
        text: 'Conferma',
        handler: (dipendenteId: number) => {
          if (!dipendenteId) {
            return false;
          }

          this.interventiService.assegnaDipendente(
            this.interventoId,
            dipendenteId
          ).subscribe({
            next: () => {
              this.caricaDipendentiAssegnati();
            },
            error: (err) => {
              console.error('Errore assegnazione dipendente:', err);
            }
          });

          return true;
        }
      }
    ]
  });

  await alert.present();
}


  accettaDataCliente() {
  if (!this.intervento) {
    return;
  }

  this.interventiService.adminProponeData(this.interventoId, {
    usa_data_cliente: true
  }).subscribe({
    next: () => {
      this.caricaIntervento();
    },
    error: (err) => {
      console.error('Errore accettazione data cliente:', err);
    }
  });
}
get dataAdminFormattata(): string {
  if (!this.dataPropostaAdmin) {
    return '';
  }

  const d = new Date(this.dataPropostaAdmin);

  return d.toLocaleDateString('it-IT');
}

confermaDataAdmin() {
  if (!this.intervento || !this.dataPropostaAdmin) {
    return;
  }

  const dataPulita = this.dataPropostaAdmin.split('T')[0];

  this.interventiService.adminProponeData(this.interventoId, {
    data_proposta_admin: dataPulita,
    usa_data_cliente: false
  }).subscribe({
    next: () => {
      this.dataPropostaAdmin = '';
      this.caricaIntervento();
    },
    error: (err) => {
      console.error('Errore proposta nuova data:', err);
    }
  });
}
async rifiutaIntervento() {
  if (!this.intervento) {
    return;
  }

  const alert = await this.alertController.create({
    header: 'Rifiuta intervento',
    message: 'Vuoi rifiutare definitivamente questo intervento?',
    cssClass: 'custom-dark-alert',
    buttons: [
      {
        text: 'Indietro',
        role: 'cancel'
      },
      {
        text: 'Rifiuta intervento',
        role: 'destructive',
        handler: () => {
          this.interventiService.adminRifiutaIntervento(
            this.interventoId
          ).subscribe({
            next: () => {
              this.caricaIntervento();
            },
            error: (err) => {
              console.error('Errore rifiuto intervento:', err);
            }
          });

          return true;
        }
      }
    ]
  });

  await alert.present();
}
}