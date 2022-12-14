import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { LoginRequestModel } from '../models/loginRequest.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  private returnUrl!: string;

  @ViewChild('loginForm') loginForm!: NgForm;

  public loginRequestModel!: LoginRequestModel;
  public errorMessage: string = '';
  public showError: boolean = false;
  
  constructor(private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute) { 
    this.loginRequestModel = new LoginRequestModel();
  }

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  onSubmit(): void {
    if (this.loginForm?.valid) {
      this.authService.login(this.loginRequestModel).subscribe({
        next: (result) => 
        {
          localStorage.setItem("token", result.token);
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

}
