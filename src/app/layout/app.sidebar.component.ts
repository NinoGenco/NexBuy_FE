import {
    AfterViewInit,
    Component,
    ElementRef,
    OnDestroy,
    ViewChild,
} from '@angular/core';
import { LayoutService } from './service/app.layout.service';
import {AppMenuComponent} from "./app.menu.component";

@Component({
    selector: 'app-sidebar',
    templateUrl: './app.sidebar.component.html',
    imports: [
        AppMenuComponent
    ],
    standalone: true
})
export class AppSidebarComponent implements OnDestroy {
    timeout: any = null;

    @ViewChild('menuContainer') menuContainer!: ElementRef;

    constructor(public layoutService: LayoutService, public el: ElementRef) {}

    resetOverlay() {
        if (this.layoutService.state.overlayMenuActive) {
            this.layoutService.state.overlayMenuActive = false;
        }
    }

    ngOnDestroy() {
        this.resetOverlay();
    }
}
