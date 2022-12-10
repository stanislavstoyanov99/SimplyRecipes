import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { NavbarDirective } from './directives/navbar.directive';
import { HttpClientModule } from '@angular/common/http';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { NgImageSliderModule } from 'ng-image-slider';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    NavbarDirective
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    HttpClientModule,
    NgbCollapseModule,
    NgImageSliderModule,
    SharedModule
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    NavbarDirective
  ]
})
export class CoreModule { }
