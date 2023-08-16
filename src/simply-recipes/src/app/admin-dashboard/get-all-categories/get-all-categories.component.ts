import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CategoriesService } from 'src/app/services/categories.service';
import { CategoryEditDialogComponent, EditCategoryDialogModel } from 'src/app/shared/dialogs/category-edit-dialog/category-edit-dialog.component';
import { ConfirmDialogModel, ConfirmationDialogComponent } from 'src/app/shared/dialogs/confirmation-dialog/confirmation-dialog.component';
import { ErrorDialogComponent } from 'src/app/shared/dialogs/error-dialog/error-dialog.component';
import { ICategoryDetails } from 'src/app/shared/interfaces/categories/category-details';

@Component({
  selector: 'app-get-all-categories',
  templateUrl: './get-all-categories.component.html',
  styleUrls: ['./get-all-categories.component.scss']
})
export class GetAllCategoriesComponent implements OnInit {

  categories: ICategoryDetails[] = [];

  constructor(
    private categoriesService: CategoriesService,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.categoriesService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
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

  onEditHandler(category: ICategoryDetails): void {
    const title = `Edit ${category.name} category with id: ${category.id}`;
    const dialogData = new EditCategoryDialogModel(title, category);
    const dialogRef = this.dialog.open(CategoryEditDialogComponent, {
      width: '50%',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(category => {
      if (category) {
        this.categoriesService.editCategory(category).subscribe({
          next: (category) => {
            const indexOfUpdatedCategory = this.categories.findIndex(x => x.id === category.id);
            this.categories[indexOfUpdatedCategory] = category;
          },
          error: (err: string) => {
            this.dialog.open(ErrorDialogComponent, {
              data: { message: err }
            });
          }
        });
      }
    });
  }

  onRemoveHandler(categoryId: number): void {
    const message = 'Are you sure you want to delete this category?';
    const dialogData = new ConfirmDialogModel('Confirmation', message);
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.categoriesService.removeCategory(categoryId).subscribe({
          next: () => {
            const indexOfDeletedArticle = this.categories.findIndex(x => x.id === categoryId);
            this.categories.splice(indexOfDeletedArticle!, 1);
          },
          error: (err: string) => {
            this.dialog.open(ErrorDialogComponent, {
              data: { message: err }
            });
          }
        });
      }
    });
  }
}
