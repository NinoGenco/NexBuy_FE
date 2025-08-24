import {NgModule} from '@angular/core';
import {PathLocationStrategy, LocationStrategy} from '@angular/common';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {AppLayoutModule} from './layout/app.layout.module';
import {NgxPermissionsModule} from "ngx-permissions";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {HttpErrorInterceptor} from "./core/interceptors/http-error.interceptor";
import {MessageService} from "primeng/api";
import {ToastModule} from "primeng/toast";
import {CustomTypeInterceptor} from "./core/interceptors/custom-type.interceptor";


@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        HttpClientModule,
        AppRoutingModule,
        AppLayoutModule,
        NgxPermissionsModule.forRoot(),
        ToastModule
    ],
    providers: [
        {
            provide: LocationStrategy,
            useClass: PathLocationStrategy
        }, {
            provide: HTTP_INTERCEPTORS,
            useClass: CustomTypeInterceptor,
            multi: true
        }, {
            provide: HTTP_INTERCEPTORS,
            useClass: HttpErrorInterceptor,
            multi: true
        },
        MessageService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
