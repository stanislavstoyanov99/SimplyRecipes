import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactsComponent } from './contacts/contacts.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PasswordConfirmationValidatorDirective } from './custom-validators/password-confirmation-validator.directive';
import { SharedRoutingModule } from './shared-routing.module';
import { GalleryComponent } from './gallery/gallery.component';
import { NgImageSliderModule } from 'ng-image-slider';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';



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
    NgxSpinnerModule.forRoot({ type: 'ball-spin-fade' }),
    MatDialogModule,
    NgbModule
  ],
  exports: [
    ContactsComponent,
    PasswordConfirmationValidatorDirective,
    GalleryComponent,
    NgxSpinnerModule,
    MatDialogModule,
    NgbModule
  ]
})
export class SharedModule { }
