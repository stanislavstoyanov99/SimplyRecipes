import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IFaqDetails } from '../shared/interfaces/faq/faq-details';
import { FaqCreateModel } from '../shared/models/faq-create-model';
import { FaqEditModel } from '../shared/models/faq-edit-model';

const apiURL = environment.apiURL;

@Injectable({
  providedIn: 'root'
})
export class FaqService {

  constructor(private httpClient: HttpClient) { }

  getAllFaqs(): Observable<IFaqDetails[]> {
    return this.httpClient.get<IFaqDetails[]>(`${apiURL}/faq/all`);
  }

  submitFaq(faqCreateInputModel: FaqCreateModel): Observable<IFaqDetails> {
    return this.httpClient.post<IFaqDetails>(`${apiURL}/faq/submit`, faqCreateInputModel);
  }

  removeFaq(faqId: number): Observable<any> {
    return this.httpClient.delete(`${apiURL}/faq/remove/${faqId}`);
  }

  editFaq(faqEditModel: FaqEditModel): Observable<IFaqDetails> {
    return this.httpClient.put<IFaqDetails>(`${apiURL}/faq/edit`, faqEditModel);
  }
}
