import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactsComponent } from './contacts/contacts.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SpinnerComponent } from './spinner/spinner.component';
import { AppRoutingModule } from '../app-routing.module';



@NgModule({
  declarations: [
    ContactsComponent,
    SpinnerComponent
  ],
  imports: [
    AppRoutingModule,
    CommonModule,
    FontAwesomeModule
  ],
  exports: [
    ContactsComponent,
    SpinnerComponent
  ]
})
export class SharedModule { }
