import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common'; 

import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonButton,
  IonIcon, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonChip
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
    CommonModule, RouterLink, IonContent, IonHeader, IonTitle, IonToolbar,
    IonButtons, IonButton, IonIcon, IonCard, IonCardHeader, IonCardTitle,
    IonCardContent, IonChip
  ]
})
export class DettaglioInterventoClientePage implements OnInit {

  interventoId = '';
  intervento: any = null; 

  constructor(
    private route: ActivatedRoute,
    private interventiService: InterventiService 
  ) {
    addIcons({ arrowBackOutline });
    this.interventoId = this.route.snapshot.paramMap.get('id') || '';
  }

  ngOnInit() {
    if (this.interventoId) {
      this.caricaDettaglio();
    }
  }

  caricaDettaglio() {
    this.interventiService.getInterventiCliente().subscribe({
      next: (tuttiGliInterventi) => {
        this.intervento = tuttiGliInterventi.find(i => i.id.toString() === this.interventoId);
        
        if (this.intervento) {
          // Mappatura date
          this.intervento.dataOra = this.intervento.data_proposta_admin 
            ? this.intervento.data_proposta_admin 
            : 'In attesa di conferma';

          this.intervento.dataPreferitaFormattata = this.intervento.data_proposta_cliente 
            ? this.intervento.data_proposta_cliente 
            : 'Nessuna preferenza indicata';
            
          // Mappatura dipendenti (gestione array)
          this.intervento.tecnicoAssegnato = (this.intervento.dipendentiAssegnati && this.intervento.dipendentiAssegnati.length > 0)
            ? this.intervento.dipendentiAssegnati.join(', ') 
            : 'In attesa di assegnazione';
        }
      },
      error: (err) => console.error('Errore durante il caricamento dell\'intervento:', err)
    });
  }
}