import { Component, OnInit } from '@angular/core';
import { RecipesService } from 'src/app/services/recipes.service';
import { IRecipeList } from 'src/app/shared/interfaces/recipes/recipe-list';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faListAlt } from '@fortawesome/free-regular-svg-icons';
import { faStar, faTachometerAlt } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-recipes-list',
  templateUrl: './recipes-list.component.html',
  styleUrls: ['./recipes-list.component.scss']
})
export class RecipesListComponent implements OnInit {

  recipesList: IRecipeList | null = null;

  constructor(private recipesService: RecipesService, private library: FaIconLibrary) {
    this.library.addIcons(faListAlt, faStar, faTachometerAlt);
  }

  ngOnInit(): void {
    this.recipesService.getRecipesList().subscribe({
      next: (value) => {
        this.recipesList = value;
      },
      error: (err) => {
        console.error(err); // TODO: Add global error handler
      }
    });
  }

  rate(i: number): Array<number> {
    return new Array(i);
  }
}
