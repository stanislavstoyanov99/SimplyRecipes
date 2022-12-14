import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { RegisterRequestModel } from '../models/registerRequest.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  @ViewChild('registerForm') registerForm!: NgForm;

  public registerRequestModel!: RegisterRequestModel;
  public errorMessage: string = '';
  public showError: boolean = false;

  constructor(private authService: AuthService) { 
    this.registerRequestModel = new RegisterRequestModel();
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.registerForm?.valid) {
      this.authService.register(this.registerRequestModel).subscribe({
        next: () => 
        {
          console.log("Successful registration");
          this.registerForm?.reset();
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
