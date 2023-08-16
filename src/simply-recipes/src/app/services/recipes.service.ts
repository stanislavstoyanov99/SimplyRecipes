import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { IRecipeList } from '../shared/interfaces/recipes/recipe-list';
import { IRecipeDetails } from '../shared/interfaces/recipes/recipe-details';
import { IRecipeListing } from '../shared/interfaces/recipes/recipe-listing';
import { ICategoryList } from '../shared/interfaces/categories/category-list';

const apiURL = environment.apiURL;

@Injectable({
  providedIn: 'root'
})
export class RecipesService {

  constructor(private httpClient: HttpClient) { }

  getAllRecipes(): Observable<IRecipeDetails[]> {
    return this.httpClient.get<IRecipeDetails[]>(`${apiURL}/recipes/all`);
  }

  getRecipesList(): Observable<IRecipeList> {
    return this.httpClient.get<IRecipeList>(`${apiURL}/recipes/list`);
  }
  
  getRecipeDetails(recipeId: number): Observable<IRecipeDetails> {
    return this.httpClient.get<IRecipeDetails>(`${apiURL}/recipes/details/${recipeId}`);
  }

  getRecipesByCategoryName(categoryName: string): Observable<IRecipeListing[]> {
    return this.httpClient.get<IRecipeListing[]>(`${apiURL}/recipes/by-category?categoryName=${categoryName}`);
  }

  getRecipesCategories(): Observable<ICategoryList[]> {
    return this.httpClient.get<ICategoryList[]>(`${apiURL}/recipes/submit`);
  }

  submitRecipe(recipeCreateInputModel: FormData): Observable<IRecipeDetails> {
    return this.httpClient.post<IRecipeDetails>(`${apiURL}/recipes/submit`, recipeCreateInputModel);
  }

  getUserRecipes(): Observable<IRecipeDetails[]> {
    return this.httpClient.get<IRecipeDetails[]>(`${apiURL}/recipes/user-recipes`);
  }

  removeRecipe(recipeId: number): Observable<any> {
    return this.httpClient.delete(`${apiURL}/recipes/remove/${recipeId}`);
  }

  editRecipe(recipeEditModel: FormData): Observable<IRecipeDetails> {
    return this.httpClient.put<IRecipeDetails>(`${apiURL}/recipes/edit`, recipeEditModel);
  }
}
