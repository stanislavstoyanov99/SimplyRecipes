import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LoginRequestModel } from './models/loginRequest.model';
import { RegisterRequestModel } from './models/registerRequest.model';
import { LoginResponse } from './interfaces/loginResponse';
import { RegisterResponse } from './interfaces/registerResponse';

const apiURL = environment.apiURL;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {
  }

  register(registerRequestModel: RegisterRequestModel) {
    return this.http.post<RegisterResponse>(`${apiURL}/identity/register`, registerRequestModel);
  }

  login(loginRequestModel: LoginRequestModel) {
    return this.http.post<LoginResponse>(`${apiURL}/identity/login`, loginRequestModel);
  }
}
