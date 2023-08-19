import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IUserDetails } from '../shared/interfaces/users/user-details';
import { Observable } from 'rxjs';
import { UserEditModel } from '../shared/models/user-edit';

const apiURL = environment.apiURL;

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private httpClient: HttpClient) { }

  getAllUsers(): Observable<IUserDetails[]> {
    return this.httpClient.get<IUserDetails[]>(`${apiURL}/applicationUsers/all`);
  }

  editUser(userEditModel: UserEditModel): Observable<IUserDetails> {
    return this.httpClient.put<IUserDetails>(`${apiURL}/applicationUsers/edit`, userEditModel);
  }

  banUser(userId: string): Observable<any> {
    return this.httpClient.delete(`${apiURL}/applicationUsers/ban/${userId}`);
  }

  unbanUser(userId: string): Observable<any> {
    return this.httpClient.delete(`${apiURL}/applicationUsers/unban/${userId}`);
  }
}
