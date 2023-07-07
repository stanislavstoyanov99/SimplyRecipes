import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactsComponent } from './contacts/contacts.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SpinnerComponent } from './spinner/spinner.component';
import { PasswordConfirmationValidatorDirective } from './custom-validators/password-confirmation-validator.directive';
import { SharedRoutingModule } from './shared-routing.module';
import { GalleryComponent } from './gallery/gallery.component';
import { NgImageSliderModule } from 'ng-image-slider';



@NgModule({
  declarations: [
    ContactsComponent,
    SpinnerComponent,
    PasswordConfirmationValidatorDirective,
    GalleryComponent
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    SharedRoutingModule,
    NgImageSliderModule
  ],
  exports: [
    ContactsComponent,
    SpinnerComponent,
    PasswordConfirmationValidatorDirective,
    GalleryComponent
  ]
})
export class SharedModule { }
