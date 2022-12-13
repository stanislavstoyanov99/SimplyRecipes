import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { RegisterRequestModel } from '../interfaces/registerRequest.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  @ViewChild('registerForm') registerForm!: NgForm;

  public registerRequestModel!: RegisterRequestModel;

  constructor(private authService: AuthService) { 
    this.registerRequestModel = new RegisterRequestModel();
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.registerForm?.valid) {
        this.registerForm?.reset();
    }
  }
}
