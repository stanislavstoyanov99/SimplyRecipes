import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LoadingService } from 'src/app/services/loading.service';
import { PrivacyService } from 'src/app/services/privacy.service';
import { ErrorDialogComponent } from 'src/app/shared/dialogs/error-dialog/error-dialog.component';
import { IPrivacyDetails } from 'src/app/shared/interfaces/privacy/privacy-details';
import { PrivacyEditModel } from 'src/app/shared/models/privacy-edit-model';

@Component({
  selector: 'app-edit-privacy',
  templateUrl: './edit-privacy.component.html',
  styleUrls: ['./edit-privacy.component.scss']
})
export class EditPrivacyComponent implements OnInit {

  formGroup!: FormGroup;
  privacy!: IPrivacyDetails;
  
  constructor(
    public loadingService: LoadingService,
    private formBuilder: FormBuilder,
    private privacyService: PrivacyService,
    private dialog: MatDialog,
    private router: Router) {
      this.formGroup = this.createForm();
  }

  ngOnInit(): void {
    this.privacyService.getPrivacy(1).subscribe({
      next: (privacy) => {
        this.privacy = privacy;
        this.formGroup.patchValue({
          pageContent: this.privacy.sanitizedPageContent
        });
      },
      error: (err: string) => {
        this.dialog.open(ErrorDialogComponent, {
          data: {
            message: err
          }
        });
      }
    });
  }

  onSubmitHandler(formGroup: FormGroup): void {
    if (formGroup.invalid) { return; }

    const { pageContent } = formGroup.value;
    const privacyEditInputModel = new PrivacyEditModel();
    privacyEditInputModel.pageContent = pageContent;

    this.privacyService.editPrivacy(privacyEditInputModel).subscribe({
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
