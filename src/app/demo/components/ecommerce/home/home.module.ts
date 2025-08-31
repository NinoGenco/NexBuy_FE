import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { RippleModule } from 'primeng/ripple';

@NgModule({
    imports: [
        CommonModule,
        HomeRoutingModule,
        RippleModule
    ],
    declarations: [HomeComponent]
})
export class HomeModule { }
