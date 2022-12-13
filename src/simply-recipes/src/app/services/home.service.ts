import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { environment } from 'src/environments/environment';
import { IRecipeListing } from '../shared/interfaces/recipe-listing';
import { IArticleListing } from '../shared/interfaces/article-listing';
import { IGallery } from '../shared/interfaces/gallery';
import { IPrivacy } from '../shared/interfaces/privacy';
import { catchError, Observable, throwError } from 'rxjs';

const apiURL = environment.apiURL;

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private httpClient: HttpClient) { }

  getTopRecipes(): Observable<IRecipeListing[]> {
    return this.httpClient.get<IRecipeListing[]>(`${apiURL}/home/top-recipes`).pipe(catchError(this.handleError));
  }

  getRecentArticles(): Observable<IArticleListing[]> {
    return this.httpClient.get<IArticleListing[]>(`${apiURL}/home/recent-articles`).pipe(catchError(this.handleError));
  }

  getGallery(): Observable<IGallery[]> {
    return this.httpClient.get<IGallery[]>(`${apiURL}/home/gallery`).pipe(catchError(this.handleError));
  }

  getPrivacy(): Observable<IPrivacy> {
    return this.httpClient.get<IPrivacy>(`${apiURL}/home/privacy`).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    // Return an observable with a user-facing error message.
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }
}