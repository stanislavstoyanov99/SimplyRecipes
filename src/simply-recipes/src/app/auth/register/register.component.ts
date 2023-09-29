import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { RegisterRequestModel } from '../models/registerRequest.model';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  public registerRequestModel: RegisterRequestModel;
  public errorMessage: string = '';
  public showError: boolean = false;

  constructor(
    public loadingService: LoadingService,
    private authService: AuthService,
    private router: Router) { 
    this.registerRequestModel = new RegisterRequestModel();
  }

  onSubmit(registerForm: NgForm): void {
    if (registerForm.valid) {
      this.authService.register(this.registerRequestModel).subscribe({
        next: () => 
        {
          this.router.navigate(["/auth/login"]);
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
