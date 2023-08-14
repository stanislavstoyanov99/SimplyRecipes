import { CommonModule } from '@angular/common';
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-create-recipe-review-dialog',
  templateUrl: './create-recipe-review-dialog.component.html',
  styleUrls: ['./create-recipe-review-dialog.component.scss'],
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    CommonModule,
    MatInputModule,
    ReactiveFormsModule]
})
export class CreateRecipeReviewDialogComponent implements OnInit {

  title: string;
  recipeId: number | undefined;
  formGroup: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<CreateRecipeReviewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RecipeReviewDialogModel,
    private formBuilder: FormBuilder) {
      this.title = data.title;
      this.recipeId = data.recipeId;
      this.formGroup = this.createForm();
  }

  ngOnInit(): void {
  }

  createForm(): FormGroup {
    this.formGroup = this.formBuilder.group({
      title: ['', [Validators.required, Validators.maxLength(30), Validators.minLength(3)]],
      content: ['', [Validators.required, Validators.maxLength(1500), Validators.minLength(10)]],
      rate: [0],
      recipeId: this.recipeId
    });
    return this.formGroup;
  }

  onConfirm(formGroup: FormGroup): void {
    if (formGroup.invalid) { return; }

    this.dialogRef.close(formGroup.value);
  }

  onDismiss(): void {
    this.dialogRef.close(null);
  }

}

export class RecipeReviewDialogModel {
  constructor(public title: string, public recipeId: number | undefined) {}
}
