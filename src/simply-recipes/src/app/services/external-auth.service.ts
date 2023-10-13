import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FacebookRequestModel } from '../auth/models/fbRequest.model';
import { AuthService } from './auth.service';
import { SocialAuthService } from '@abacritt/angularx-social-login';
import { LoginResponse } from '../auth/interfaces/loginResponse';
import { IUser } from '../shared/interfaces/user';
import { Observable, map } from 'rxjs';
import { RevokeTokenResponse } from '../auth/interfaces/revokeTokenResponse';

const apiURL = environment.apiURL;

@Injectable({
  providedIn: 'root'
})
export class ExternalAuthService {

  private refreshTokenTimeout?: NodeJS.Timeout;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private socialAuthService: SocialAuthService) { }

  public authenticateWithFb(fbRequestModel: FacebookRequestModel) {
    return this.http.post<LoginResponse>(`${apiURL}/externalauth/authenticate-with-fb`, fbRequestModel)
      .pipe(map((response) => {
        return this.processLogin(response);
      }));
  }

  public fbLogout(): void {
    this.http.post<RevokeTokenResponse>(`${apiURL}/identity/revoke-token`, {}).subscribe();
    this.stopRefreshTokenTimer();
    this.socialAuthService.signOut(true);
    localStorage.removeItem("token");
    localStorage.removeItem("fbUser");
    this.authService.sendAuthStateChangeNotification(false);
  }

  public refreshToken(): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${apiURL}/identity/refresh-token`, {})
        .pipe(map((response) => {
          return this.processLogin(response);
        }));
  }

  private processLogin(loginResponse: LoginResponse): LoginResponse {
    localStorage.setItem("token", loginResponse.token);

    const user: IUser = {
      id: loginResponse.userId,
      email: loginResponse.email,
      username: loginResponse.username,
      isAdmin: loginResponse.isAdmin
    };
    
    localStorage.setItem("fbUser", JSON.stringify(user));
    this.authService.sendAuthStateChangeNotification(loginResponse.isAuthSuccessful);

    this.startRefreshTokenTimer();

    return loginResponse;
  }

  private startRefreshTokenTimer(): void {
    // parse json object from base64 encoded jwt token
    const token = this.authService.getToken();
    const jwtBase64 = token!.split('.')[1];
    const jwtToken = JSON.parse(atob(jwtBase64));

    // set a timeout to refresh the token a minute before it expires
    const expires = new Date(jwtToken.exp * 1000);
    const timeout = expires.getTime() - Date.now() - (60 * 1000);
    this.refreshTokenTimeout = setTimeout(() => this.refreshToken().subscribe(), timeout);
  }

  private stopRefreshTokenTimer(): void {
    clearTimeout(this.refreshTokenTimeout);
  }
}
