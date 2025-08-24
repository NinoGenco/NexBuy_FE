import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputGroupModule } from 'primeng/inputgroup';
import {ProfileSettingsRoutingModule} from "./profile-settings-routing.module";
import {ProfileSettingsComponent} from "./profile-settings.component";
import {ChipModule} from "primeng/chip";
import {NgxPermissionsModule} from "ngx-permissions";
import {UserService} from "../../../../shared/services/user.service";
import {Observable} from "rxjs";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ProfileSettingsRoutingModule,
        ButtonModule,
        RippleModule,
        InputTextModule,
        DropdownModule,
        FileUploadModule,
        InputTextareaModule,
        InputGroupModule,
        InputGroupAddonModule,
        ChipModule,
        NgxPermissionsModule
    ],
	declarations: [ProfileSettingsComponent]
})
export class ProfileSettingsModule {
}
