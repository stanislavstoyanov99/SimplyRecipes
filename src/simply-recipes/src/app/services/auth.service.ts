import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { RegisterRequestModel } from '../auth/models/registerRequest.model';
import { RegisterResponse } from '../auth/interfaces/registerResponse';
import { LoginRequestModel } from '../auth/models/loginRequest.model';
import { LoginResponse } from '../auth/interfaces/loginResponse';

const apiURL = environment.apiURL;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authChangeSub$$ = new BehaviorSubject<boolean>(false);
  public authChanged$ = this.authChangeSub$$.asObservable();

  constructor(private http: HttpClient, private jwtHelper: JwtHelperService) { }

  public isUserAuthenticated = (): boolean => {
    const token = localStorage.getItem("token");
 
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      return true;
    }
    return false;
  }

  public sendAuthStateChangeNotification = (isAuthenticated: boolean) => {
    this.authChangeSub$$.next(isAuthenticated);
  }

  public register(registerRequestModel: RegisterRequestModel) {
    return this.http.post<RegisterResponse>(`${apiURL}/identity/register`, registerRequestModel);
  }

  public login(loginRequestModel: LoginRequestModel) {
    return this.http.post<LoginResponse>(`${apiURL}/identity/login`, loginRequestModel);
  }

  public logout() {
    localStorage.removeItem("token");
    this.sendAuthStateChangeNotification(false);
  }
}
