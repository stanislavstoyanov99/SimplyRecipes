import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FacebookRequestModel } from '../auth/models/fbRequest.model';
import { AuthService } from './auth.service';
import { SocialAuthService } from '@abacritt/angularx-social-login';
import { LoginResponse } from '../auth/interfaces/loginResponse';

const apiURL = environment.apiURL;

@Injectable({
  providedIn: 'root'
})
export class ExternalAuthService {

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private socialAuthService: SocialAuthService) { }

  public authenticateWithFb(fbRequestModel: FacebookRequestModel) {
    return this.http.post<LoginResponse>(`${apiURL}/externalauth/authenticatewithfb`, fbRequestModel);
  }

  public fbLogout(): void {
    this.socialAuthService.signOut(true);
    localStorage.removeItem("token");
    localStorage.removeItem("fbUser");
    this.authService.sendAuthStateChangeNotification(false);
  }
}
