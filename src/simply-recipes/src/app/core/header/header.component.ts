import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faUtensils, faUser } from '@fortawesome/free-solid-svg-icons';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from 'src/app/shared/error-dialog/error-dialog.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  isMenuCollapsed = true;
  public isUserAuthenticated: boolean = false;
  
  constructor(
    private authService: AuthService,
    private router: Router,
    private library: FaIconLibrary,
    private dialog: MatDialog) {
    this.library.addIcons(faUtensils, faUser);
  }

  ngOnInit(): void {
    this.authService.authChanged$
      .subscribe({
        next: (value) => {
          this.isUserAuthenticated = value;
        },
        error: (err) => {
          this.dialog.open(ErrorDialogComponent, {
            data: {
              message: err
            }
          });
        }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(["/"]);
  }

}