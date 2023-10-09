import { Component, OnInit } from '@angular/core';
import { RecipesService } from 'src/app/services/recipes.service';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faListAlt } from '@fortawesome/free-regular-svg-icons';
import { faStar, faTachometerAlt } from '@fortawesome/free-solid-svg-icons';
import { LoadingService } from 'src/app/services/loading.service';
import { ErrorDialogComponent } from 'src/app/shared/dialogs/error-dialog/error-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Difficulty } from 'src/app/shared/enums/difficulty';
import { PageResult, rate } from 'src/app/shared/utils/utils';
import { IRecipeListing } from 'src/app/shared/interfaces/recipes/recipe-listing';
import { ICategoryDetails } from 'src/app/shared/interfaces/categories/category-details';
import { CategoriesService } from 'src/app/services/categories.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-recipes-list',
  templateUrl: './recipes-list.component.html',
  styleUrls: ['./recipes-list.component.scss']
})
export class RecipesListComponent implements OnInit {

  recipesPaginated: PageResult<IRecipeListing> = {
    count: 0,
    items: [],
    pageNumber: 1,
    pageSize: 0
  };
  categories: ICategoryDetails[] = [];
  Difficulty = Difficulty;
  rate = rate;
  currentCategoryName: string = 'All';
  pageNumber: number = 1;
  pageSize: number = 10;
  count: number = 0;
  
  constructor(
    public loadingService: LoadingService,
    private recipesService: RecipesService,
    private categoriesService: CategoriesService,
    private library: FaIconLibrary,
    private dialog: MatDialog,
    private location: Location) {
    this.library.addIcons(faListAlt, faStar, faTachometerAlt);
  }

  ngOnInit(): void {
    this.getRecipesPaginated(this.currentCategoryName, 1);
    this.getAllCategories();
  }

  onCategoryClickHandler(categoryName: string): void {
    this.currentCategoryName = categoryName;
    this.getRecipesPaginated(this.currentCategoryName, 1);
  }

  onAllClickHandler(): void {
    this.currentCategoryName = 'All';
    this.getRecipesPaginated(this.currentCategoryName, 1);
  }

  onPageChange(pageNumber: number): void {
    this.getRecipesPaginated(this.currentCategoryName, pageNumber);
  }

  private getRecipesPaginated(categoryName: string, pageNumber?: number): void {
    this.recipesService.getAllRecipesPaginated(categoryName, pageNumber).subscribe({
      next: (recipesPaginated) => {
        this.location.go(`/recipes/all?categoryName=${categoryName}&pageNumber=${pageNumber}`);
        this.recipesPaginated = recipesPaginated;
        this.pageNumber = this.recipesPaginated.pageNumber;
        this.count = this.recipesPaginated.count;
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

  private getAllCategories(): void {
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
}
