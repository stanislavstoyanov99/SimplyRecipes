import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { IFaqDetails } from '../../interfaces/faq/faq-details';
import { FaqService } from 'src/app/services/faq.service';
import { FaqEditModel } from '../../models/faq-edit-model';

@Component({
  selector: 'app-faq-edit-dialog',
  templateUrl: './faq-edit-dialog.component.html',
  styleUrls: ['./faq-edit-dialog.component.scss'],
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    CommonModule,
    MatInputModule,
    ReactiveFormsModule]
})
export class FaqEditDialogComponent {

  title: string;
  faq: IFaqDetails;
  formGroup: FormGroup;

  constructor(public dialogRef: MatDialogRef<FaqEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EditFaqDialogModel,
    private formBuilder: FormBuilder,
    private faqService: FaqService,
    private dialog: MatDialog) {
      this.title = data.title;
      this.faq = data.faq;
      this.formGroup = this.createForm();
  }

    createForm(): FormGroup {
      this.formGroup = this.formBuilder.group({
        question: [this.faq.question, [Validators.required, Validators.maxLength(100), Validators.minLength(10)]],
        answer: [this.faq.answer, [Validators.required, Validators.maxLength(1000), Validators.minLength(10)]]
      });
      return this.formGroup;
    }
  
    onConfirm(formGroup: FormGroup): void {
      if (formGroup.invalid) { return; }
  
      const { question, answer } = formGroup.value;
      const faqEditModel = new FaqEditModel();
      faqEditModel.id = this.faq.id;
      faqEditModel.question = question;
      faqEditModel.answer = answer;
  
      this.dialogRef.close(faqEditModel);
    }
  
    onDismiss(): void {
      this.dialogRef.close(null);
    }
}

export class EditFaqDialogModel {
  constructor(public title: string, public faq: IFaqDetails) {}
}