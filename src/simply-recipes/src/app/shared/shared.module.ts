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
import { FileTypeValidatorDirective } from './custom-validators/file-type-validator.directive';
import { FacebookLoginProvider, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';



@NgModule({
  declarations: [
    ContactsComponent,
    PasswordConfirmationValidatorDirective,
    GalleryComponent,
    FileTypeValidatorDirective
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
    NgbModule,
    FontAwesomeModule,
  ],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('6916590581697654'),
          },
        ],
      } as SocialAuthServiceConfig,
    },
  ]
})
export class SharedModule { }
