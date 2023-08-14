import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoadingService } from 'src/app/services/loading.service';
import { RecipesService } from 'src/app/services/recipes.service';
import { ConfirmDialogModel, ConfirmationDialogComponent } from 'src/app/shared/dialogs/confirmation-dialog/confirmation-dialog.component';
import { ErrorDialogComponent } from 'src/app/shared/dialogs/error-dialog/error-dialog.component';
import { EditRecipeDialogModel, RecipeEditDialogComponent } from 'src/app/shared/dialogs/recipe-edit-dialog/recipe-edit-dialog.component';
import { Difficulty } from 'src/app/shared/enums/difficulty';
import { IRecipeDetails } from 'src/app/shared/interfaces/recipes/recipe-details';

@Component({
  selector: 'app-recipes-view',
  templateUrl: './recipes-view.component.html',
  styleUrls: ['./recipes-view.component.scss']
})
export class RecipesViewComponent implements OnInit {

  userRecipes: IRecipeDetails[] = [];
  Difficulty = Difficulty;

  constructor(
    public loadingService: LoadingService,
    private recipesService: RecipesService,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.getUserRecipes();
  }

  onDeleteHandler(recipeId: number): void {
    const message = 'Are you sure you want to delete this recipe?';
    const dialogData = new ConfirmDialogModel('Confirmation', message);
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.recipesService.removeRecipe(recipeId).subscribe({
          next: () => {
            this.getUserRecipes();
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

  onEditHandler(recipe: IRecipeDetails): void {
    const title = `Edit recipe ${recipe.name}`;
    const dialogData = new EditRecipeDialogModel(title, recipe);
    const dialogRef = this.dialog.open(RecipeEditDialogComponent, {
      maxWidth: '50%',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(recipe => {
      if (recipe) {
        this.recipesService.editRecipe(recipe).subscribe({
          next: (recipe) => {
            const indexOfUpdatedRecipe = this.userRecipes.findIndex(x => x.id === recipe.id);
            this.userRecipes[indexOfUpdatedRecipe] = recipe;
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

  private getUserRecipes(): void {
    this.recipesService.getUserRecipes().subscribe({
      next: (userRecipes) => {
        this.userRecipes = userRecipes;
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
