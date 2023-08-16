import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CategoriesService } from 'src/app/services/categories.service';
import { LoadingService } from 'src/app/services/loading.service';
import { ErrorDialogComponent } from 'src/app/shared/dialogs/error-dialog/error-dialog.component';

@Component({
  selector: 'app-create-category',
  templateUrl: './create-category.component.html',
  styleUrls: ['./create-category.component.scss']
})
export class CreateCategoryComponent {

  formGroup: FormGroup;
  
  constructor(
    public loadingService: LoadingService,
    private formBuilder: FormBuilder,
    private categoriesService: CategoriesService,
    private dialog: MatDialog,
    private router: Router) {
      this.formGroup = this.createForm();
  }

  onSubmitHandler(formGroup: FormGroup): void {
    if (formGroup.invalid) { return; }

    const { name, description } = formGroup.value;
    const categoryCreateInputModel = new FormData();
    categoryCreateInputModel.append('name', name);
    categoryCreateInputModel.append('description', description);

    this.categoriesService.submitCategory(categoryCreateInputModel).subscribe({
      next: (category) => {
        setTimeout(() => {
          this.router.navigate([`/admin-dashboard/main/categories/get-all`]);
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
      name: ['', [Validators.required, Validators.maxLength(30), Validators.minLength(2)]],
      description: ['', [Validators.required, Validators.maxLength(500), Validators.minLength(50)]]
    });
    return this.formGroup;
  }
}
