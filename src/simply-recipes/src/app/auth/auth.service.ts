import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, filter, Subscription, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IUser } from '../shared/interfaces/user';
import { LoginRequestModel } from './interfaces/loginRequest.model';
import { RegisterRequestModel } from './interfaces/registerRequest.model';

const apiURL = environment.apiURL;

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {

  private user$$ = new BehaviorSubject<undefined | null | IUser>(undefined);
  
  user$ = this.user$$.asObservable().pipe(
    filter((val): val is IUser | null => val !== undefined)
  );

  user: IUser | null = null;
  
  get isLoggedIn() {
    return this.user !== null;
  }

  subscription: Subscription;
  
  constructor(private http: HttpClient) {
    this.subscription = this.user$.subscribe(user => {
      this.user = user;
    });
  }

  register(registerRequestModel: RegisterRequestModel) {
    return this.http.post<IUser>(`${apiURL}/identity/register`, registerRequestModel)
      .pipe(tap(user => this.user$$.next(user)));
  }

  login(loginRequestModel: LoginRequestModel) {
    return this.http.post<any>(`${apiURL}/identity/login`, loginRequestModel)
      .pipe(tap(user => this.user$$.next(user)));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
