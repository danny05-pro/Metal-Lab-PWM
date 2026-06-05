import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  IonContent,
  IonButton,
  IonIcon
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';

import {
  hammerOutline,
  constructOutline,
  settingsOutline,
  documentTextOutline,
  calendarOutline,
  clipboardOutline,
  speedometerOutline,
  gitPullRequestOutline
} from 'ionicons/icons';
import { HeaderComponent } from '../../components/header/header.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    HeaderComponent,
    IonContent,
    IonButton,
    IonIcon,
    RouterLink
  ]
})
export class HomePage {
  
  constructor() {
    addIcons({
      hammerOutline,
      constructOutline,
      settingsOutline,
      documentTextOutline,
      calendarOutline,
      clipboardOutline,
      speedometerOutline,
      gitPullRequestOutline
    });
  }
}
