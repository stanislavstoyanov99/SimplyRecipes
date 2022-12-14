import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactsComponent } from './contacts/contacts.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SpinnerComponent } from './spinner/spinner.component';
import { PasswordConfirmationValidatorDirective } from './custom-validators/password-confirmation-validator.directive';
import { SharedRoutingModule } from './shared-routing.module';



@NgModule({
  declarations: [
    ContactsComponent,
    SpinnerComponent,
    PasswordConfirmationValidatorDirective
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    SharedRoutingModule
  ],
  exports: [
    ContactsComponent,
    SpinnerComponent,
    PasswordConfirmationValidatorDirective
  ]
})
export class SharedModule { }
