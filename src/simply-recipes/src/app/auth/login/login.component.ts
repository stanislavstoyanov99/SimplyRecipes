import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { LoginRequestModel } from '../models/loginRequest.model';
import { FacebookLoginProvider, SocialAuthService } from '@abacritt/angularx-social-login';
import { ExternalAuthService } from 'src/app/services/external-auth.service';
import { FacebookRequestModel } from '../models/fbRequest.model';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faFacebook } from '@fortawesome/free-brands-svg-icons';

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
    private externalAuthService: ExternalAuthService,
    private library: FaIconLibrary) { 
      this.loginRequestModel = new LoginRequestModel();
      this.library.addIcons(faFacebook);
  }

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  onSubmit(loginForm: NgForm): void {
    if (loginForm.valid) {
      this.authService.login(this.loginRequestModel).subscribe({
        next: (response) => 
        {
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

        return requestModel;
      })
      .then(requestModel => {
        this.externalAuthService.authenticateWithFb(requestModel).subscribe({
          next: (response) => {
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
