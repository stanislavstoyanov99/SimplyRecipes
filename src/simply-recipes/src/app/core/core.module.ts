import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { NavbarDirective } from './directives/navbar.directive';
import { HttpClientModule } from '@angular/common/http';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../shared/shared.module';
import { AppRoutingModule } from '../app-routing.module';


@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    NavbarDirective
  ],
  imports: [
    AppRoutingModule,
    CommonModule,
    FontAwesomeModule,
    HttpClientModule,
    NgbCollapseModule,
    SharedModule
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    NavbarDirective
  ]
})
export class CoreModule { }
