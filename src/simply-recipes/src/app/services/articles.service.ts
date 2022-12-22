import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IArticleDetails } from '../shared/interfaces/articles/article-details';
import { IArticleListing } from '../shared/interfaces/articles/article-listing';

const apiURL = environment.apiURL;

@Injectable({
  providedIn: 'root'
})
export class ArticlesService {

  constructor(private httpClient: HttpClient) { }

  getArticles(): Observable<IArticleListing[]> {
    return this.httpClient.get<IArticleListing[]>(`${apiURL}/articles`);
  }

  getArticleById(id: number): Observable<IArticleDetails> {
    return this.httpClient.get<IArticleDetails>(`${apiURL}/articles/details/${id}`);
  }

  getArticlesByCategoryName(categoryName: string): Observable<IArticleListing[]> {
    return this.httpClient.get<IArticleListing[]>(`${apiURL}/articles/by-category?categoryName=${categoryName}`);
  }
}
