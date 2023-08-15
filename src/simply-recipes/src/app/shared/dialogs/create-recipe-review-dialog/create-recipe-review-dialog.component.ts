import { CommonModule } from '@angular/common';
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';

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
    ReactiveFormsModule,
    MatTooltipModule]
})
export class CreateRecipeReviewDialogComponent implements OnInit {

  title: string;
  recipeId: number | undefined;
  recipeRate: number;
  formGroup: FormGroup;
  ratingArr: number[] = [];
  private starCount: number = 5;

  constructor(
    public dialogRef: MatDialogRef<CreateRecipeReviewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RecipeReviewDialogModel,
    private formBuilder: FormBuilder) {
      this.title = data.title;
      this.recipeId = data.recipeId;
      this.recipeRate = data.recipeRate;
      this.formGroup = this.createForm();
  }

  ngOnInit(): void {
    for (let index = 0; index < this.starCount; index++) {
      this.ratingArr.push(index);
    }
  }

  createForm(): FormGroup {
    this.formGroup = this.formBuilder.group({
      title: ['', [Validators.required, Validators.maxLength(30), Validators.minLength(3)]],
      content: ['', [Validators.required, Validators.maxLength(1500), Validators.minLength(10)]],
      rate: [this.recipeRate],
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

  onRateHandler(rate: number) {
    this.formGroup.value['rate'] = rate;
    this.recipeRate = rate;
  }

  showIcon(index: number) {
    if (this.recipeRate >= index + 1) {
      return 'star';
    } else {
      return 'star_border';
    }
  }
}

export class RecipeReviewDialogModel {
  constructor(public title: string, public recipeId: number | undefined, public recipeRate: number) {}
}
