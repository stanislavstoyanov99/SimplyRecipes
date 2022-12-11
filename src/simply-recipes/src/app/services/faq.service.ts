import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IFaq } from '../shared/interfaces/faq';

const apiURL = environment.apiURL;

@Injectable({
  providedIn: 'root'
})
export class FaqService {

  constructor(private httpClient: HttpClient) { }

  getFaqs() {
    return this.httpClient.get<IFaq[]>(`${apiURL}/faq`);
  }
}
