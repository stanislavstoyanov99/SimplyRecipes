import { Component, OnInit } from '@angular/core';
import { RecipesService } from 'src/app/services/recipes.service';
import { IRecipeList } from 'src/app/shared/interfaces/recipes/recipe-list';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faListAlt } from '@fortawesome/free-regular-svg-icons';
import { faStar, faTachometerAlt } from '@fortawesome/free-solid-svg-icons';
import { LoadingService } from 'src/app/services/loading.service';
import { ErrorDialogComponent } from 'src/app/shared/error-dialog/error-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Difficulty } from 'src/app/shared/enums/difficulty';
import { rate } from 'src/app/shared/utils/utils';

@Component({
  selector: 'app-recipes-list',
  templateUrl: './recipes-list.component.html',
  styleUrls: ['./recipes-list.component.scss']
})
export class RecipesListComponent implements OnInit {

  recipesList: IRecipeList = {
    recipes: [],
    categories: []
  };
  Difficulty = Difficulty;
  rate = rate;
  
  constructor(
    public loadingService: LoadingService,
    private recipesService: RecipesService,
    private library: FaIconLibrary,
    private dialog: MatDialog) {
    this.library.addIcons(faListAlt, faStar, faTachometerAlt);
  }

  ngOnInit(): void {
    this.getRecipesList();
  }

  onCategoryClickHandler(categoryName: string): void {
    this.recipesService.getRecipesByCategoryName(categoryName).subscribe({
      next: (recipes) => {
        this.recipesList.recipes = recipes;
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

  onAllClickHandler(): void {
    this.getRecipesList();
  }

  private getRecipesList(): void {
    this.recipesService.getRecipesList().subscribe({
      next: (recipesList) => {
        this.recipesList = recipesList;
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
