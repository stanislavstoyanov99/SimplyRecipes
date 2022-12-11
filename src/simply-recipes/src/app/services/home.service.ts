import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment';
import { IRecipeListing } from '../shared/interfaces/recipe-listing';
import { IArticleListing } from '../shared/interfaces/article-listing';
import { IGallery } from '../shared/interfaces/gallery';
import { IPrivacy } from '../shared/interfaces/privacy';

const apiURL = environment.apiURL;

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private httpClient: HttpClient) { }

  getTopRecipes() {
    return this.httpClient.get<IRecipeListing[]>(`${apiURL}/home/top-recipes`);
  }

  getRecentArticles() {
    return this.httpClient.get<IArticleListing[]>(`${apiURL}/home/recent-articles`);
  }

  getGallery() {
    return this.httpClient.get<IGallery[]>(`${apiURL}/home/gallery`);
  }

  getPrivacy() {
    return this.httpClient.get<IPrivacy>(`${apiURL}/home/privacy`);
  }
}