import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { RegisterRequestModel } from '../auth/models/registerRequest.model';
import { RegisterResponse } from '../auth/interfaces/registerResponse';
import { LoginRequestModel } from '../auth/models/loginRequest.model';
import { LoginResponse } from '../auth/interfaces/loginResponse';
import { IUser } from '../shared/interfaces/user';
import { RevokeTokenResponse } from '../auth/interfaces/revokeTokenResponse';

const apiURL = environment.apiURL;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authChangeSub$$ = new BehaviorSubject<boolean>(false);
  private refreshTokenTimeout?: NodeJS.Timeout;
  public authChanged$ = this.authChangeSub$$.asObservable();

  constructor(private http: HttpClient, private jwtHelper: JwtHelperService) { }

  public isUserAuthenticated = (): boolean => {
    const token = localStorage.getItem("token");
 
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      return true;
    }
    return false;
  }

  public getUser = (): IUser | null => {
    const user = localStorage.getItem('user') || localStorage.getItem('fbUser');
    if (user === null) {
      return null;
    }
    return JSON.parse(user);
  }

  public sendAuthStateChangeNotification = (isAuthenticated: boolean) => {
    this.authChangeSub$$.next(isAuthenticated);
  }

  public register(registerRequestModel: RegisterRequestModel): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${apiURL}/identity/register`, registerRequestModel);
  }

  public login(loginRequestModel: LoginRequestModel): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${apiURL}/identity/login`, loginRequestModel)
      .pipe(map((response) => {
        return this.processLogin(response);
      }));
  }

  public logout(): void {
    this.http.post<RevokeTokenResponse>(`${apiURL}/identity/revoke-token`, {}).subscribe();
    this.stopRefreshTokenTimer();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    this.sendAuthStateChangeNotification(false);
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

    localStorage.setItem("user", JSON.stringify(user));
    this.sendAuthStateChangeNotification(loginResponse.isAuthSuccessful);
    this.startRefreshTokenTimer();

    return loginResponse;
  }

  private startRefreshTokenTimer(): void {
    // parse json object from base64 encoded jwt token
    const token = localStorage.getItem("token");
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
