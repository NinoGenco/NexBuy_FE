import {Component} from '@angular/core';
import {MenubarModule} from 'primeng/menubar';
import {NgClass, NgIf} from '@angular/common';
import {BadgeModule} from 'primeng/badge';
import {AvatarModule} from 'primeng/avatar';
import {MenuItem} from 'primeng/api';
import {RippleModule} from 'primeng/ripple';
import {InputTextModule} from 'primeng/inputtext';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    NgClass,
    NgIf,
    MenubarModule,
    BadgeModule,
    AvatarModule,
    InputTextModule,
    RippleModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  items: MenuItem[] | undefined;

}
