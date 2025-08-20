import { Component } from '@angular/core';
import {HeaderComponent} from './shared/components/header/header.component';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
}
