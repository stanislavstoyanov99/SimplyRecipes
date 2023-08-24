import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IPrivacyDetails } from '../shared/interfaces/privacy/privacy-details';
import { PrivacyCreateModel } from '../shared/models/privacy-create-model';
import { PrivacyEditModel } from '../shared/models/privacy-edit-model';

const apiURL = environment.apiURL;

@Injectable({
  providedIn: 'root'
})
export class PrivacyService {

  constructor(private httpClient: HttpClient) { }

  getPrivacy(privacyId: number): Observable<IPrivacyDetails> {
    return this.httpClient.get<IPrivacyDetails>(`${apiURL}/privacy/${privacyId}`);
  }

  submitPrivacy(privacyCreateModel: PrivacyCreateModel): Observable<IPrivacyDetails> {
    return this.httpClient.post<IPrivacyDetails>(`${apiURL}/privacy/submit`, privacyCreateModel);
  }

  editPrivacy(privacyEditModel: PrivacyEditModel): Observable<IPrivacyDetails> {
    return this.httpClient.put<IPrivacyDetails>(`${apiURL}/privacy/edit`, privacyEditModel);
  }
}
