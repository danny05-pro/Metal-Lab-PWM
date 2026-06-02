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

@Component({
  selector: 'app-dettaglio-intervento-admin',
  templateUrl: './dettaglio-intervento-admin.page.html',
  styleUrls: ['./dettaglio-intervento-admin.page.scss'],
  standalone: true,
  imports: [
    RouterLink, IonContent, IonHeader, IonTitle, IonToolbar, IonButtons,
    IonButton, IonIcon, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonChip
  ]
})
export class DettaglioInterventoAdminPage implements OnInit {

  interventoId = '';
  intervento: Intervento | null = null; // Inizializzato a null (dati reali dal DB)
  
  // Lista vuota, da popolare tramite service con i dipendenti reali dal DB
  dipendentiDisponibili: string[] = []; 

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private alertController: AlertController
  ) {
    addIcons({ arrowBackOutline });
    this.interventoId = this.route.snapshot.paramMap.get('id') || '';
  }

  ngOnInit() {
    // TODO: Qui devi chiamare il tuo service per caricare i dati reali dell'intervento
    // e la lista dei dipendenti disponibili dal DB
  }

  async assegnaDipendente() {
    if (!this.intervento) return;

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
        { text: 'Annulla', role: 'cancel' },
        {
          text: 'Conferma',
          handler: (dipendenteSelezionato: string) => {
            if (!dipendenteSelezionato || !this.intervento) return false;

            // Inizializza array se non esiste
            if (!this.intervento.dipendentiAssegnati) {
              this.intervento.dipendentiAssegnati = [];
            }

            // Aggiungi dipendente se non già presente
            if (!this.intervento.dipendentiAssegnati.includes(dipendenteSelezionato)) {
              this.intervento.dipendentiAssegnati.push(dipendenteSelezionato);
            }

            // Aggiorna lo stato admin nel database
            this.intervento.stato_admin = 'Data proposta'; 
            
            // TODO: Inserire qui la chiamata al service per salvare sul DB
            this.router.navigate(['/dashboard-admin']);
            return true;
          }
        }
      ]
    });

    await alert.present();
  }
}