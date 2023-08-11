import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IPostArticleComment } from '../shared/interfaces/article-comments/post-article-comment';
import { IArticleComment } from '../shared/interfaces/article-comments/article-comment';

const apiURL = environment.apiURL;

@Injectable({
  providedIn: 'root'
})
export class ArticleCommentsService {

  constructor(private httpClient: HttpClient) { }

  postComment(postArticleCommentModel: IPostArticleComment): Observable<IArticleComment> {
    return this.httpClient.post<IArticleComment>(`${apiURL}/articlecomments/comment`, postArticleCommentModel);
  }
}
