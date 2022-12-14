import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LoginRequestModel } from './models/loginRequest.model';
import { RegisterRequestModel } from './models/registerRequest.model';
import { LoginResponse } from './interfaces/loginResponse';
import { RegisterResponse } from './interfaces/registerResponse';
import { Subject } from 'rxjs';

const apiURL = environment.apiURL;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authChangeSub = new Subject<boolean>();
  public authChanged = this.authChangeSub.asObservable();

  constructor(private http: HttpClient) {
  }

  public sendAuthStateChangeNotification = (isAuthenticated: boolean) => {
    this.authChangeSub.next(isAuthenticated);
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
