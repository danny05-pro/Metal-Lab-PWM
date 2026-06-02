import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AlertController } from '@ionic/angular';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonButton,
  IonIcon, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonChip
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import { arrowBackOutline } from 'ionicons/icons';
import { Intervento } from 'src/app/models/intervento.model';
import { InterventiService } from '../../services/interventi.service'; // Importa il tuo service

@Component({
  selector: 'app-dettaglio-intervento-dipendente',
  templateUrl: './dettaglio-intervento-dipendente.page.html',
  styleUrls: ['./dettaglio-intervento-dipendente.page.scss'],
  standalone: true,
  imports: [
    RouterLink, IonContent, IonHeader, IonTitle, IonToolbar, IonButtons,
    IonButton, IonIcon, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonChip
  ]
})
export class DettaglioInterventoDipendentePage implements OnInit {

  interventoId = '';
  intervento: Intervento | null = null; // Inizializzato a null, nessun dato fittizio

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private alertController: AlertController,
    private interventiService: InterventiService // Inietta il service
  ) {
    addIcons({ arrowBackOutline });
    this.interventoId = this.route.snapshot.paramMap.get('id') || '';
  }

  ngOnInit() {
    // Qui chiamerai il metodo per caricare i dati reali
    // this.caricaInterventoReale();
  }

  async modificaStatoIntervento() {
    if (!this.intervento) return; // Controllo di sicurezza

    const alert = await this.alertController.create({
      header: 'Modifica stato intervento',
      message: 'Seleziona il nuovo stato di lavorazione.',
      cssClass: 'custom-dark-alert',
      inputs: [
        { type: 'radio', label: 'Programmato', value: 'Programmato', checked: this.intervento.stato_lavorazione === 'Programmato' },
        { type: 'radio', label: 'In lavorazione', value: 'In lavorazione', checked: this.intervento.stato_lavorazione === 'In lavorazione' },
        { type: 'radio', label: 'Terminato', value: 'Terminato', checked: this.intervento.stato_lavorazione === 'Terminato' }
      ],
      buttons: [
        { text: 'Annulla', role: 'cancel' },
        { 
          text: 'Conferma', 
          handler: (nuovoStato: any) => {
            if (!nuovoStato || !this.intervento) return false;
            
            this.intervento.stato_lavorazione = nuovoStato;

            if (nuovoStato === 'Terminato') {
              this.intervento.dataOra = new Date().toLocaleDateString('it-IT');
            }

            // QUI aggiungerai la chiamata al backend per salvare il cambio stato
            this.router.navigate(['/dashboard-dipendente']);
            return true;
          }
        }
      ]
    });

    await alert.present();
  }
}