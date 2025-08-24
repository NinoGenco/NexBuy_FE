import {Component, ElementRef, ViewChild} from '@angular/core';
import {AppConfig, LayoutService} from './service/app.layout.service';
import {StyleClassModule} from "primeng/styleclass";
import {NgClass, NgIf} from "@angular/common";
import {Subscription} from "rxjs";
import {MessageService} from "primeng/api";
import {AuthService} from "../shared/services/auth.service";

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html',
    imports: [
        StyleClassModule,
        NgClass,
        NgIf
    ],
    standalone: true
})
export class AppTopbarComponent {

    @ViewChild('menuButton') menuButton!: ElementRef;
    @ViewChild('mobileMenuButton') mobileMenuButton!: ElementRef;

    private config!: AppConfig;
    private subscription: Subscription;

    constructor(protected layoutService: LayoutService,
                private el: ElementRef) {
        this.subscription = this.layoutService.configUpdate$.subscribe(
            (config) => {
                this.config = config;
            }
        );
    }

    onMenuButtonClick() {
        this.layoutService.onMenuToggle();
    }

}
