import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {ProfileSettingsComponent} from "./profile-settings.component";


@NgModule({
    imports: [RouterModule.forChild([
        {path: '', component: ProfileSettingsComponent}
    ])],
    exports: [RouterModule]
})
export class ProfileSettingsRoutingModule {
}
