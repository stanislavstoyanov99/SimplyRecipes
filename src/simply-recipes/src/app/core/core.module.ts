import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { NavbarDirective } from './directives/navbar.directive';
import { HttpClientModule } from '@angular/common/http';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../shared/shared.module';
import { AppRoutingModule } from '../app-routing.module';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';


@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    NavbarDirective,
    PageNotFoundComponent
  ],
  imports: [
    AppRoutingModule,
    CommonModule,
    HttpClientModule,
    NgbCollapseModule,
    SharedModule
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    NavbarDirective,
    PageNotFoundComponent
  ]
})
export class CoreModule { }
