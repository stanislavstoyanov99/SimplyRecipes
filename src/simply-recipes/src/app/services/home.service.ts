import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment';
import { IRecipeListing } from '../shared/interfaces/recipes/recipe-listing';
import { IArticleListing } from '../shared/interfaces/articles/article-listing';
import { IGallery } from '../shared/interfaces/gallery';
import { IPrivacy } from '../shared/interfaces/privacy/privacy';
import { Observable } from 'rxjs';

const apiURL = environment.apiURL;

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private httpClient: HttpClient) { }

  getTopRecipes(): Observable<IRecipeListing[]> {
    return this.httpClient.get<IRecipeListing[]>(`${apiURL}/home/top-recipes`);
  }

  getRecentArticles(): Observable<IArticleListing[]> {
    return this.httpClient.get<IArticleListing[]>(`${apiURL}/home/recent-articles`);
  }

  getGallery(): Observable<IGallery[]> {
    return this.httpClient.get<IGallery[]>(`${apiURL}/home/gallery`);
  }

  getPrivacy(): Observable<IPrivacy> {
    return this.httpClient.get<IPrivacy>(`${apiURL}/home/privacy`);
  }
}