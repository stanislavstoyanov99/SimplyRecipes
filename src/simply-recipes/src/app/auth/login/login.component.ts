import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { LoginRequestModel } from '../models/loginRequest.model';
import { IUser } from 'src/app/shared/interfaces/user';
import { FacebookLoginProvider, SocialAuthService } from '@abacritt/angularx-social-login';
import { ExternalAuthService } from 'src/app/services/external-auth.service';
import { FacebookRequestModel } from '../models/fbRequest.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  private returnUrl!: string;

  public loginRequestModel: LoginRequestModel;
  public errorMessage: string = '';
  public showError: boolean = false;
  
  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private socialAuthService: SocialAuthService,
    private externalAuthService: ExternalAuthService) { 
    this.loginRequestModel = new LoginRequestModel();
  }

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  onSubmit(loginForm: NgForm): void {
    if (loginForm.valid) {
      this.authService.login(this.loginRequestModel).subscribe({
        next: (response) => 
        {
          localStorage.setItem("token", response.token);
          const user: IUser = {
            id: response.userId,
            email: response.email,
            username: response.username,
            isAdmin: response.isAdmin
          };
          
          localStorage.setItem("user", JSON.stringify(user));
          this.authService.sendAuthStateChangeNotification(response.isAuthSuccessful);
          this.router.navigate([this.returnUrl]);
        },
        error: (err: HttpErrorResponse) =>
        {
          this.errorMessage = err.message;
          this.showError = true;
        }
      });
    }
  }

  loginWithFacebook(): void {
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID)
      .then(facebookUser => {
        const requestModel = new FacebookRequestModel();
        requestModel.facebookIdentifier = facebookUser.id;
        requestModel.facebookAccessToken = facebookUser.authToken;
        requestModel.email = facebookUser.email;
        requestModel.firstName = facebookUser.firstName;
        requestModel.lastName = facebookUser.lastName;
        requestModel.userName = facebookUser.name;

        this.externalAuthService.authenticateWithFb(requestModel).subscribe({
          next: (response) => {
            localStorage.setItem("token", response.token);

            const fbUser: IUser = {
              id: response.userId,
              email: response.email,
              username: response.username,
              isAdmin: response.isAdmin
            };
            
            localStorage.setItem("fbUser", JSON.stringify(fbUser));
            this.authService.sendAuthStateChangeNotification(response.isAuthSuccessful);
            this.router.navigate([this.returnUrl]);
          },
          error: (err: HttpErrorResponse) =>
          {
            this.errorMessage = err.message;
            this.showError = true;
          }
        });
      })
      .catch(error => {
        this.errorMessage = error;
        this.showError = true;
      });
  }

}
