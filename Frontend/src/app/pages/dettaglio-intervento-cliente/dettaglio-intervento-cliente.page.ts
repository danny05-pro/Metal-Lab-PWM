import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common'; // <-- Utile per gestire i dati asincroni nell'HTML

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

import { InterventiService } from '../../services/interventi.service';

@Component({
  selector: 'app-dettaglio-intervento-cliente',
  templateUrl: './dettaglio-intervento-cliente.page.html',
  styleUrls: ['./dettaglio-intervento-cliente.page.scss'],
  standalone: true,
  imports: [
    CommonModule, // <-- Aggiunto
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
export class DettaglioInterventoClientePage implements OnInit {

  interventoId = '';
  // Lo inizializziamo a null. L'HTML si aggiornerà non appena i dati arriveranno dal backend.
  intervento: any = null; 

  constructor(
    private route: ActivatedRoute,
    private interventiService: InterventiService // <-- Iniettiamo il service
  ) {
    addIcons({ arrowBackOutline });
    this.interventoId = this.route.snapshot.paramMap.get('id') || '';
  }

  // Eseguiamo la chiamata all'avvio della pagina
  ngOnInit() {
    if (this.interventoId) {
      this.caricaDettaglio();
    }
  }

  caricaDettaglio() {
    this.interventiService.getInterventiCliente().subscribe({
      next: (tuttiGliInterventi) => {
        // Peschiamo dall'array l'intervento con l'ID corrispondente a quello dell'URL
        this.intervento = tuttiGliInterventi.find(i => i.id.toString() === this.interventoId);
        
        // Adattiamo i nomi dei campi per farli coincidere col tuo HTML
        if (this.intervento) {
          this.intervento.dataOra = this.intervento.data_intervento || this.intervento.data_preferita || 'Data non ancora fissata';
          this.intervento.tecnicoAssegnato = this.intervento.dipendente_id ? `ID Tecnico: ${this.intervento.dipendente_id}` : 'In attesa di assegnazione';
        }
      },
      error: (err) => console.error('Errore durante il caricamento dell\'intervento:', err)
    });
  }

}