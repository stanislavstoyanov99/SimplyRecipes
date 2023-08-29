import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { IRecipeDetails } from '../shared/interfaces/recipes/recipe-details';
import { IRecipeListing } from '../shared/interfaces/recipes/recipe-listing';
import { ICategoryList } from '../shared/interfaces/categories/category-list';
import { PageResult } from '../shared/utils/utils';

const apiURL = environment.apiURL;

@Injectable({
  providedIn: 'root'
})
export class RecipesService {

  constructor(private httpClient: HttpClient) { }

  getAllRecipes(): Observable<IRecipeDetails[]> {
    return this.httpClient.get<IRecipeDetails[]>(`${apiURL}/recipes/all`);
  }

  getAllRecipesPaginated(categoryName: string, pageNumber?: number): Observable<PageResult<IRecipeListing>> {
    return this.httpClient.get<PageResult<IRecipeListing>>(`${apiURL}/recipes/all/${categoryName}/${pageNumber}`);
  }
  
  getRecipeDetails(recipeId: number): Observable<IRecipeDetails> {
    return this.httpClient.get<IRecipeDetails>(`${apiURL}/recipes/details/${recipeId}`);
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
