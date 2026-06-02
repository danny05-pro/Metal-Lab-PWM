import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AlertController } from '@ionic/angular';

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
  IonChip
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import { arrowBackOutline } from 'ionicons/icons';

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
    IonChip
  ]
})
export class DettaglioInterventoAdminPage implements OnInit {

  interventoId = '';

  intervento: Intervento | null = null;

  caricamento = true;

  dipendentiDisponibili: string[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private alertController: AlertController,
    private interventiService: InterventiService
  ) {
    addIcons({
      arrowBackOutline
    });
  }

  ngOnInit() {
    this.interventoId = this.route.snapshot.paramMap.get('id') || '';

    this.caricaIntervento();
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

  async assegnaDipendente() {
    if (!this.intervento) {
      return;
    }

    const alert = await this.alertController.create({
      header: 'Assegna dipendente',
      message: 'Seleziona il dipendente da assegnare a questo intervento.',
      cssClass: 'custom-dark-alert',
      inputs: this.dipendentiDisponibili.map(dipendente => ({
        type: 'radio',
        label: dipendente,
        value: dipendente
      })),
      buttons: [
        {
          text: 'Annulla',
          role: 'cancel'
        },
        {
          text: 'Conferma',
          handler: (dipendenteSelezionato: string) => {
            if (!dipendenteSelezionato || !this.intervento) {
              return false;
            }

            if (!this.intervento.dipendentiAssegnati) {
              this.intervento.dipendentiAssegnati = [];
            }

            if (!this.intervento.dipendentiAssegnati.includes(dipendenteSelezionato)) {
              this.intervento.dipendentiAssegnati.push(dipendenteSelezionato);
            }

            this.router.navigate(['/dashboard-admin']);

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
async proponiAltraData() {
  const alert = await this.alertController.create({
    header: 'Proponi nuova data',
    message: 'Inserisci una data alternativa da proporre al cliente.',
    cssClass: 'custom-dark-alert',
    inputs: [
      {
        name: 'data',
        type: 'date',
        placeholder: 'Seleziona data'
      }
    ],
    buttons: [
      {
        text: 'Annulla',
        role: 'cancel'
      },
      {
        text: 'Conferma',
        handler: (data: any) => {
          if (!data.data) {
            return false;
          }

          this.interventiService.adminProponeData(this.interventoId, {
            data_proposta_admin: data.data,
            usa_data_cliente: false
          }).subscribe({
            next: () => {
              this.caricaIntervento();
            },
            error: (err) => {
              console.error('Errore proposta nuova data:', err);
            }
          });

          return true;
        }
      }
    ]
  });

  await alert.present();
}
async rifiutaIntervento() {
  const alert = await this.alertController.create({
    header: 'Rifiuta intervento',
    message: 'Inserisci il motivo del rifiuto.',
    cssClass: 'custom-dark-alert',
    inputs: [
      {
        name: 'motivo',
        type: 'textarea',
        placeholder: 'Motivo del rifiuto'
      }
    ],
    buttons: [
      {
        text: 'Annulla',
        role: 'cancel'
      },
      {
        text: 'Rifiuta',
        role: 'destructive',
        handler: (data: any) => {
          this.interventiService.adminRifiutaIntervento(
            this.interventoId,
            data.motivo || ''
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