import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RecipesService } from 'src/app/services/recipes.service';
import { ErrorDialogComponent } from 'src/app/shared/error-dialog/error-dialog.component';
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
    private recipesService: RecipesService,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.getUserRecipes();
  }

  onDeleteHandler(recipeId: number): void {
    this.recipesService.removeRecipe(recipeId).subscribe({
      next: () => {
        this.getUserRecipes();
       }, // TODO: Open success dialog
      error: (err: string) => {
        this.dialog.open(ErrorDialogComponent, {
          data: {
            message: err
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
