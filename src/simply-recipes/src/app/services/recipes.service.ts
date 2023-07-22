import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { IRecipeList } from '../shared/interfaces/recipes/recipe-list';
import { IRecipeDetails } from '../shared/interfaces/recipes/recipe-details';
import { IRecipeListing } from '../shared/interfaces/recipes/recipe-listing';

const apiURL = environment.apiURL;

@Injectable({
  providedIn: 'root'
})
export class RecipesService {

  constructor(private httpClient: HttpClient) { }

  getRecipesList(): Observable<IRecipeList> {
    return this.httpClient.get<IRecipeList>(`${apiURL}/recipes/list`);
  }
  
  getRecipeDetails(recipeId: number): Observable<IRecipeDetails> {
    return this.httpClient.get<IRecipeDetails>(`${apiURL}/recipes/details/${recipeId}`);
  }

  getRecipesByCategoryName(categoryName: string): Observable<IRecipeListing[]> {
    return this.httpClient.get<IRecipeListing[]>(`${apiURL}/recipes/by-category?categoryName=${categoryName}`);
  }
}
