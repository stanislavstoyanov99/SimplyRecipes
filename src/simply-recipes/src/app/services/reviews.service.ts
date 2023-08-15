import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IReviewCreate } from '../shared/interfaces/reviews/review-create';
import { IReviewDetails } from '../shared/interfaces/reviews/review-details';

const apiURL = environment.apiURL;

@Injectable({
  providedIn: 'root'
})
export class ReviewsService {

  constructor(private httpClient: HttpClient) { }

  submitReview(reviewCreateInputModel: IReviewCreate): Observable<IReviewDetails> {
    return this.httpClient.post<IReviewDetails>(`${apiURL}/reviews/send-review`, reviewCreateInputModel);
  }

  removeReview(reviewId: number): Observable<number> {
    return this.httpClient.delete<number>(`${apiURL}/reviews/remove/${reviewId}`);
  }
}
