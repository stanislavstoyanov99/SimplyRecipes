import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IUserDetails } from '../shared/interfaces/users/user-details';
import { Observable } from 'rxjs';

const apiURL = environment.apiURL;

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private httpClient: HttpClient) { }

  getAllUsers(): Observable<IUserDetails[]> {
    return this.httpClient.get<IUserDetails[]>(`${apiURL}/applicationUsers/all`);
  }
}
