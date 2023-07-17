import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IRecipeListing } from '../shared/interfaces/recipes/recipe-listing';
import { Observable } from 'rxjs';

const apiURL = environment.apiURL;

@Injectable({
  providedIn: 'root'
})
export class RecipesService {

  constructor(private httpClient: HttpClient) { }

  getRecipesList(): Observable<IRecipeListing[]> {
    return this.httpClient.get<IRecipeListing[]>(`${apiURL}/recipes/list`);
  }
}
