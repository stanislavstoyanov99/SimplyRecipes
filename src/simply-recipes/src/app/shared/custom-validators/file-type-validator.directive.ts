import { Directive } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

@Directive({
  selector: '[FileTypeValidator]',
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: FileTypeValidatorDirective,
    multi: true
  }]
})
export class FileTypeValidatorDirective implements Validator {

  validate(control: AbstractControl<any, any>): ValidationErrors | null {
    return FileTypeValidatorDirective.validate(control);
  }

  static validate(control: AbstractControl<any, any>): ValidationErrors | null {
    if (control.value) {
      return FileTypeValidatorDirective.checkExtension(control);
    }
    return null;
  }

  private static checkExtension(control: AbstractControl) {
    let valueToLower = control.value.toLowerCase();
    let regex = new RegExp("(.*?)\.(jpg|png|jpeg)$");
    let regexTest = regex.test(valueToLower);

    return !regexTest ? { "notSupportedFileType": true } : null;
  }
}
