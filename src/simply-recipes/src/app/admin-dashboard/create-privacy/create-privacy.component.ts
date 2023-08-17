import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LoadingService } from 'src/app/services/loading.service';
import { PrivacyService } from 'src/app/services/privacy.service';
import { ErrorDialogComponent } from 'src/app/shared/dialogs/error-dialog/error-dialog.component';
import { PrivacyCreateModel } from 'src/app/shared/models/privacy-create-model';

@Component({
  selector: 'app-create-privacy',
  templateUrl: './create-privacy.component.html',
  styleUrls: ['./create-privacy.component.scss']
})
export class CreatePrivacyComponent {
  
  formGroup: FormGroup;
  
  constructor(
    public loadingService: LoadingService,
    private formBuilder: FormBuilder,
    private privacyService: PrivacyService,
    private dialog: MatDialog,
    private router: Router) {
      this.formGroup = this.createForm();
  }

  onSubmitHandler(formGroup: FormGroup): void {
    if (formGroup.invalid) { return; }

    const { pageContent } = formGroup.value;
    const privacyCreateInputModel = new PrivacyCreateModel();
    privacyCreateInputModel.pageContent = pageContent;

    this.privacyService.submitPrivacy(privacyCreateInputModel).subscribe({
      next: (privacy) => {
        setTimeout(() => {
          this.router.navigate(['/privacy']);
        }, 3000);
      },
      error: (err: string) => {
        this.dialog.open(ErrorDialogComponent, {
          data: {
            message: err
          }
        });
        this.router.navigate(['/']);
      }
    });
  }

  createForm(): FormGroup {
    this.formGroup = this.formBuilder.group({
      pageContent: ['', [Validators.required, Validators.maxLength(15000), Validators.minLength(1000)]]
    });
    return this.formGroup;
  }

}
