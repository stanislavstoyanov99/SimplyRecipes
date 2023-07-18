import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { RecipesService } from "src/app/services/recipes.service";
import { IRecipeDetails } from "src/app/shared/interfaces/recipes/recipe-details";

@Injectable({
  providedIn: 'root'
})
export class RecipeResolver implements Resolve<IRecipeDetails | null> {
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