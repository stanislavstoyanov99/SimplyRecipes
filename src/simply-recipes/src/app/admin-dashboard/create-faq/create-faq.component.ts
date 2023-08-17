import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FaqService } from 'src/app/services/faq.service';
import { LoadingService } from 'src/app/services/loading.service';
import { ErrorDialogComponent } from 'src/app/shared/dialogs/error-dialog/error-dialog.component';
import { FaqCreateModel } from 'src/app/shared/models/faq-create-model';

@Component({
  selector: 'app-create-faq',
  templateUrl: './create-faq.component.html',
  styleUrls: ['./create-faq.component.scss']
})
export class CreateFaqComponent {

  formGroup: FormGroup;
  
  constructor(
    public loadingService: LoadingService,
    private formBuilder: FormBuilder,
    private faqService: FaqService,
    private dialog: MatDialog,
    private router: Router) {
      this.formGroup = this.createForm();
  }

  onSubmitHandler(formGroup: FormGroup): void {
    if (formGroup.invalid) { return; }

    const { question, answer } = formGroup.value;
    const faqCreateInputModel = new FaqCreateModel();
    faqCreateInputModel.question = question;
    faqCreateInputModel.answer = answer;

    this.faqService.submitFaq(faqCreateInputModel).subscribe({
      next: (faq) => {
        setTimeout(() => {
          this.router.navigate(['/admin-dashboard/main/faqs/get-all']);
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
      question: ['', [Validators.required, Validators.maxLength(100), Validators.minLength(10)]],
      answer: ['', [Validators.required, Validators.maxLength(1000), Validators.minLength(10)]]
    });
    return this.formGroup;
  }

}
