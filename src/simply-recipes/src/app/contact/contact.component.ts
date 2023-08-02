import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ContactModel } from '../shared/models/contact.model';
import { ContactService } from '../services/contact.service';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { Subscription } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit, OnDestroy {

  @ViewChild('contactForm') contactForm!: NgForm;
  
  lat = 51.678418;
  lng = 7.809007;

  public contact!: ContactModel;
  private subscription!: Subscription;

  constructor(
    private contactService: ContactService,
    private recaptchaV3Service: ReCaptchaV3Service,
    private spinner: NgxSpinnerService) {
      this.contact = new ContactModel();
  }

  // TODO: Could not find another way without using DOM to show/hide recaptcha badge
  ngOnInit(): void {
    this.spinner.show();

    setTimeout(() => {
      this.spinner.hide();
    }, 1000);

    const element = document.getElementsByClassName('grecaptcha-badge')[0] as HTMLElement;
    if (element) {
      element.style.visibility = 'visible';
    }
  }

  onSubmit(): void {
    if (this.contactForm?.valid) {
      this.subscription = this.recaptchaV3Service.execute('importantAction').subscribe((token: string) => {
        this.contact.recaptchaValue = token;
        this.contactService.sendContact(this.contact).subscribe(() => {
          this.contactForm?.reset();
        });
      });
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    const element = document.getElementsByClassName('grecaptcha-badge')[0] as HTMLElement;
    if (element) {
      element.style.visibility = 'hidden';
    }
  }
}