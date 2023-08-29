import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IArticleListing } from '../shared/interfaces/articles/article-listing';
import { IArticleSidebar } from '../shared/interfaces/articles/article-sidebar';
import { IArticleDetails } from '../shared/interfaces/articles/article-details';
import { ICategoryList } from '../shared/interfaces/categories/category-list';
import { PageResult } from '../shared/utils/utils';

const apiURL = environment.apiURL;

@Injectable({
  providedIn: 'root'
})
export class ArticlesService {

  constructor(private httpClient: HttpClient) { }

  getArticles(pageNumber?: number): Observable<PageResult<IArticleListing>> {
    return this.httpClient.get<PageResult<IArticleListing>>(`${apiURL}/articles/${pageNumber}`);
  }

  getAllArticles(pageNumber?: number): Observable<PageResult<IArticleDetails>> {
    return this.httpClient.get<PageResult<IArticleDetails>>(`${apiURL}/articles/all/${pageNumber}`);
  }

  getArticleById(id: number): Observable<IArticleListing> {
    return this.httpClient.get<IArticleListing>(`${apiURL}/articles/details/${id}`);
  }

  getArticleSidebar(): Observable<IArticleSidebar> {
    return this.httpClient.get<IArticleSidebar>(`${apiURL}/articles/sidebar`);
  }

  getArticlesByCategoryName(categoryName: string, pageNumber?: number): Observable<PageResult<IArticleListing>> {
    return this.httpClient.get<PageResult<IArticleListing>>(`${apiURL}/articles/by-category/${categoryName}/${pageNumber}`);
  }

  getArticlesBySearchTitle(searchTitle: string, pageNumber?: number): Observable<PageResult<IArticleListing>> {
    return this.httpClient.get<PageResult<IArticleListing>>(`${apiURL}/articles/search/${searchTitle}/${pageNumber}`);
  }

  getArticleCategories(): Observable<ICategoryList[]> {
    return this.httpClient.get<ICategoryList[]>(`${apiURL}/articles/submit`);
  }

  submitArticle(articleCreateInputModel: FormData): Observable<IArticleDetails> {
    return this.httpClient.post<IArticleDetails>(`${apiURL}/articles/submit`, articleCreateInputModel);
  }

  removeArticle(articleId: number): Observable<any> {
    return this.httpClient.delete(`${apiURL}/articles/remove/${articleId}`);
  }

  editArticle(articleEditModel: FormData): Observable<IArticleDetails> {
    return this.httpClient.put<IArticleDetails>(`${apiURL}/articles/edit`, articleEditModel);
  }
}
