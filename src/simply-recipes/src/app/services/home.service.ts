import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment';
import { IRecipeListing } from '../shared/interfaces/recipe-listing';

const apiURL = environment.apiURL;

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private httpClient: HttpClient) { }

  getTopRecipes() {
    return this.httpClient.get<IRecipeListing[]>(`${apiURL}/Home/top-recipes`);
  }
}