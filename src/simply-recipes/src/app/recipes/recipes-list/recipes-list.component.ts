import { Component, OnInit } from '@angular/core';
import { RecipesService } from 'src/app/services/recipes.service';
import { IRecipeListing } from 'src/app/shared/interfaces/recipes/recipe-listing';

@Component({
  selector: 'app-recipes-list',
  templateUrl: './recipes-list.component.html',
  styleUrls: ['./recipes-list.component.scss']
})
export class RecipesListComponent implements OnInit {

  recipes: IRecipeListing[] | null = null;

  constructor(private recipesService: RecipesService) { }

  ngOnInit(): void {
    this.recipesService.getRecipesList().subscribe({
      next: (value) => {
        this.recipes = value;
      },
      error: (err) => {
        console.error(err); // TODO: Add global error handler
      }
    });
  }

}
