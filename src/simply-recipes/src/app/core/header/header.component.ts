import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  isMenuCollapsed = true;
  public isUserAuthenticated: boolean = false;
  
  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.authService.authChanged
      .subscribe(result => {
        this.isUserAuthenticated = result;
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(["/"]);
  }

}