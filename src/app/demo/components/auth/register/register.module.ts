import {NgModule} from '@angular/core';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import {CheckboxModule} from 'primeng/checkbox';
import {FormsModule} from '@angular/forms';
import {AppConfigModule} from 'src/app/layout/config/app.config.module';
import {RippleModule} from 'primeng/ripple';
import {MessageModule} from "primeng/message";
import {RegisterRoutingModule} from "./register-routing.module";
import {RegisterComponent} from "./register.component";
import {CommonModule, NgIf} from "@angular/common";
import {PasswordModule} from "primeng/password";


@NgModule({
    imports: [
        CommonModule,
        RegisterRoutingModule,
        ButtonModule,
        InputTextModule,
        CheckboxModule,
        FormsModule,
        AppConfigModule,
        RippleModule,
        MessageModule,
        NgIf,
        PasswordModule
    ],
    declarations: [RegisterComponent]
})
export class RegisterModule {
}
