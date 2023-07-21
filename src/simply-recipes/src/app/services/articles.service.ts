import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IArticleListing } from '../shared/interfaces/articles/article-listing';
import { IArticleSidebar } from '../shared/interfaces/articles/article-sidebar';

const apiURL = environment.apiURL;

@Injectable({
  providedIn: 'root'
})
export class ArticlesService {

  constructor(private httpClient: HttpClient) { }

  getArticles(): Observable<IArticleListing[]> {
    return this.httpClient.get<IArticleListing[]>(`${apiURL}/articles`);
  }

  getArticleById(id: number): Observable<IArticleListing> {
    return this.httpClient.get<IArticleListing>(`${apiURL}/articles/details/${id}`);
  }

  getArticleSidebar(): Observable<IArticleSidebar> {
    return this.httpClient.get<IArticleSidebar>(`${apiURL}/articles/sidebar`);
  }

  getArticlesByCategoryName(categoryName: string): Observable<IArticleListing[]> {
    return this.httpClient.get<IArticleListing[]>(`${apiURL}/articles/by-category?categoryName=${categoryName}`);
  }

  getArticlesBySearchTitle(searchTitle: string): Observable<IArticleListing[]> {
    return this.httpClient.get<IArticleListing[]>(`${apiURL}/articles/search?searchTitle=${searchTitle}`);
  }
}
