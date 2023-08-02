import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactsComponent } from './contacts/contacts.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PasswordConfirmationValidatorDirective } from './custom-validators/password-confirmation-validator.directive';
import { SharedRoutingModule } from './shared-routing.module';
import { GalleryComponent } from './gallery/gallery.component';
import { NgImageSliderModule } from 'ng-image-slider';
import { NgxSpinnerModule } from 'ngx-spinner';



@NgModule({
  declarations: [
    ContactsComponent,
    PasswordConfirmationValidatorDirective,
    GalleryComponent
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    SharedRoutingModule,
    NgImageSliderModule,
    NgxSpinnerModule.forRoot({ type: 'ball-spin-fade' })
  ],
  exports: [
    ContactsComponent,
    PasswordConfirmationValidatorDirective,
    GalleryComponent,
    NgxSpinnerModule
  ]
})
export class SharedModule { }
