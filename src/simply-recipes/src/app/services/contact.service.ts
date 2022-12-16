import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ContactModel } from '../shared/models/contact.model';

const apiURL = environment.apiURL;

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  constructor(private httpClient: HttpClient) { }

  sendContact(contact: ContactModel) {
    return this.httpClient.post(`${apiURL}/contacts`, contact);
  }
}
