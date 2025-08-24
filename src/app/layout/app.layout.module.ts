import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {InputTextModule} from 'primeng/inputtext';
import {SidebarModule} from 'primeng/sidebar';
import {BadgeModule} from 'primeng/badge';
import {RadioButtonModule} from 'primeng/radiobutton';
import {InputSwitchModule} from 'primeng/inputswitch';
import {TooltipModule} from 'primeng/tooltip';
import {RippleModule} from 'primeng/ripple';
import {AppConfigModule} from './config/app.config.module';
import {AppLayoutComponent} from './app.layout.component';
import {AppBreadcrumbComponent} from './app.breadcrumb.component';
import {AppMenuitemComponent} from './app.menuitem.component';
import {RouterModule} from '@angular/router';
import {AppFooterComponent} from "../shared/components/footer/footer.component";
import {MegaMenuModule} from 'primeng/megamenu';
import {ButtonModule} from 'primeng/button';
import {MenuModule} from 'primeng/menu';
import {StyleClassModule} from 'primeng/styleclass';
import {CheckboxModule} from 'primeng/checkbox';
import {AppHeaderComponent} from "../shared/components/header/header.component";
import {NgxPermissionsModule} from "ngx-permissions";
import {ToastModule} from "primeng/toast";


@NgModule({
    declarations: [
        AppLayoutComponent,
        AppBreadcrumbComponent,
        AppHeaderComponent,
        AppMenuitemComponent,
        AppFooterComponent,
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpClientModule,
        BrowserAnimationsModule,
        StyleClassModule,
        InputTextModule,
        SidebarModule,
        BadgeModule,
        RadioButtonModule,
        InputSwitchModule,
        TooltipModule,
        MegaMenuModule,
        RippleModule,
        RouterModule,
        ButtonModule,
        MenuModule,
        AppConfigModule,
        CheckboxModule,
        NgxPermissionsModule,
        ToastModule
    ],
})
export class AppLayoutModule {
}
