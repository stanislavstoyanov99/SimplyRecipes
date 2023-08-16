import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ICategoryDetails } from '../../interfaces/categories/category-details';

@Component({
  selector: 'app-category-edit-dialog',
  templateUrl: './category-edit-dialog.component.html',
  styleUrls: ['./category-edit-dialog.component.scss'],
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    CommonModule,
    MatInputModule,
    ReactiveFormsModule]
})
export class CategoryEditDialogComponent {

  title: string;
  category: ICategoryDetails;
  formGroup: FormGroup;

  constructor(public dialogRef: MatDialogRef<CategoryEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EditCategoryDialogModel,
    private formBuilder: FormBuilder) {
      this.title = data.title;
      this.category = data.category;
      this.formGroup = this.createForm();
  }

  createForm(): FormGroup {
    this.formGroup = this.formBuilder.group({
      name: [this.category.name, [Validators.required, Validators.maxLength(30), Validators.minLength(2)]],
      description: [this.category.sanitizedDescription, [Validators.required, Validators.maxLength(500), Validators.minLength(50)]]
    });
    return this.formGroup;
  }

  onConfirm(formGroup: FormGroup): void {
    if (formGroup.invalid) { return; }

    const { name, description } = formGroup.value;
    const categoryEditModel = new FormData();
    categoryEditModel.append('id', this.category.id.toString());
    categoryEditModel.append('name', name);
    categoryEditModel.append('description', description);

    this.dialogRef.close(categoryEditModel);
  }

  onDismiss(): void {
    this.dialogRef.close(null);
  }
}

export class EditCategoryDialogModel {
  constructor(public title: string, public category: ICategoryDetails) {}
}
