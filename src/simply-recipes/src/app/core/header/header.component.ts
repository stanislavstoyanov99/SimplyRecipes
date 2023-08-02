import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faUtensils } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  isMenuCollapsed = true;
  public isUserAuthenticated: boolean = false;
  
  constructor(private authService: AuthService, private router: Router, private library: FaIconLibrary) {
    this.library.addIcons(faUtensils);
  }

  ngOnInit(): void {
    this.authService.authChanged$
      .subscribe({
        next: (value) => {
          this.isUserAuthenticated = value;
        },
        error: (err) => {
          console.error(err); // TODO: Add global error handler
        }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(["/"]);
  }

}