import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Contact } from '../shared/interfaces/contact';
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

  public contact!: Contact;

  constructor(private contactService: ContactService,
    private recaptchaV3Service: ReCaptchaV3Service) {
  }

  onSubmit(): void {
    if (this.contactForm?.valid) {
      this.recaptchaV3Service.execute('importantAction').subscribe((token: string) => {
        this.contact.recaptchaValue = token;
        this.contactService.sendContact(this.contact);
        this.contactForm?.reset();
      });
    }
  }
}