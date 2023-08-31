import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FacebookRequestModel } from '../auth/models/fbRequest.model';
import { FacebookResponseModel } from '../auth/models/fbResponse.model';

const apiURL = environment.apiURL;

@Injectable({
  providedIn: 'root'
})
export class ExternalAuthService {

  constructor(private http: HttpClient) { }

  public authenticateWithFb(fbRequestModel: FacebookRequestModel) {
    return this.http.post<FacebookResponseModel>(`${apiURL}/externalauth/authenticatewithfb`, fbRequestModel);
  }
}
