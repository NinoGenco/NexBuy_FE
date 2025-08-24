import {Component} from '@angular/core';
import {LayoutService} from "../../../layout/service/app.layout.service";


@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html'
})
export class AppFooterComponent {

    constructor(protected layoutService: LayoutService) {}

}
