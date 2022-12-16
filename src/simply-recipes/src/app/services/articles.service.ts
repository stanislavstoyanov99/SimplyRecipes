import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IArticleListing } from '../shared/interfaces/article-listing';

const apiURL = environment.apiURL;

@Injectable({
  providedIn: 'root'
})
export class ArticlesService {

  constructor(private httpClient: HttpClient) { }

  getArticles(): Observable<IArticleListing[]> {
    return this.httpClient.get<IArticleListing[]>(`${apiURL}/articles`);
  }
}
