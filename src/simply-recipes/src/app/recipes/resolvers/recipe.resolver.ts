import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { RecipesService } from "src/app/services/recipes.service";
import { IRecipeDetails } from "src/app/shared/interfaces/recipes/recipe-details";

@Injectable({
  providedIn: 'root'
})
export class RecipeResolver  {
  constructor(private recipesService: RecipesService, private router: Router) { }
  
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): 
    IRecipeDetails | null | Observable<IRecipeDetails> | Promise<IRecipeDetails> {
    const recipeId = route.params['id'];
    if (!recipeId) {
      this.router.navigate(['/recipes/main']);
      return null;
    }
    return this.recipesService.getRecipeDetails(recipeId);
  }
}