import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

@Directive({
  selector: '[appPasswordConfirmationValidator]',
  providers: [{provide: NG_VALIDATORS, useExisting: PasswordConfirmationValidatorDirective, multi: true}]
})
export class PasswordConfirmationValidatorDirective implements Validator {

  @Input('appPasswordConfirmationValidator') password = '';

  validate(passwordControl: AbstractControl): ValidationErrors | null {
      const passwordValue = passwordControl.value;

      if (this.password === '') {
          return null;
      }
      
      if (this.password !== passwordValue) {
          return  { mustMatch: true };
      }

      return null;
    };
}
