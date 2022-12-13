import { Component, Input, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { ContactModel } from '../core/models/contact.model';
import { ContactService } from '../services/contact.service';
import { ReCaptchaV3Service } from 'ng-recaptcha';


@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent {

  @ViewChild('contactForm') contactForm!: NgForm;
  
  lat = 51.678418;
  lng = 7.809007;

  public contactModel: ContactModel;

  constructor(private contactService: ContactService,
    private recaptchaV3Service: ReCaptchaV3Service) {
    this.contactModel = new ContactModel();
  }

  onSubmit(): void {
    if (this.contactForm?.valid) {
      this.recaptchaV3Service.execute('importantAction').subscribe((token: string) => {
        this.contactModel.recaptchaValue = token;
        this.contactService.sendContact(this.contactModel);
        this.contactForm?.reset();
      });
    }
  }
}