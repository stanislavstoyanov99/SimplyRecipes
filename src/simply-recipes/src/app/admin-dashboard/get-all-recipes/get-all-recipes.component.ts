import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RecipesService } from 'src/app/services/recipes.service';
import { ConfirmDialogModel, ConfirmationDialogComponent } from 'src/app/shared/dialogs/confirmation-dialog/confirmation-dialog.component';
import { ErrorDialogComponent } from 'src/app/shared/dialogs/error-dialog/error-dialog.component';
import { EditRecipeDialogModel, RecipeEditDialogComponent } from 'src/app/shared/dialogs/recipe-edit-dialog/recipe-edit-dialog.component';
import { IRecipeDetails } from 'src/app/shared/interfaces/recipes/recipe-details';

@Component({
  selector: 'app-get-all-recipes',
  templateUrl: './get-all-recipes.component.html',
  styleUrls: ['./get-all-recipes.component.scss']
})
export class GetAllRecipesComponent implements OnInit {

  recipes: IRecipeDetails[] = [];
  
  constructor(
    private recipesService: RecipesService,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.recipesService.getAllRecipes().subscribe({
      next: (recipes) => {
        this.recipes = recipes;
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

  onEditHandler(recipe: IRecipeDetails): void {
    const title = `Edit ${recipe.name} recipe with id: ${recipe.id}`;
    const dialogData = new EditRecipeDialogModel(title, recipe);
    const dialogRef = this.dialog.open(RecipeEditDialogComponent, {
      width: '50%',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(recipe => {
      if (recipe) {
        this.recipesService.editRecipe(recipe).subscribe({
          next: (recipe) => {
            const indexOfUpdatedRecipe = this.recipes.findIndex(x => x.id === recipe.id);
            this.recipes[indexOfUpdatedRecipe] = recipe;
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

  onRemoveHandler(recipeId: number): void {
    const message = 'Are you sure you want to delete this recipe?';
    const dialogData = new ConfirmDialogModel('Confirmation', message);
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.recipesService.removeRecipe(recipeId).subscribe({
          next: () => {
            const indexOfDeletedRecipe = this.recipes.findIndex(x => x.id === recipeId);
            this.recipes.splice(indexOfDeletedRecipe!, 1);
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
