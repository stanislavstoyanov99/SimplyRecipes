import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faUtensils, faUser } from '@fortawesome/free-solid-svg-icons';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from 'src/app/shared/dialogs/error-dialog/error-dialog.component';
import { ExternalAuthService } from 'src/app/services/external-auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public isMenuCollapsed = true;
  public isUserAuthenticated: boolean = false;
  public isUserAdmin: boolean | undefined = false;
  public username: string | undefined;
  
  constructor(
    private authService: AuthService,
    private router: Router,
    private library: FaIconLibrary,
    private dialog: MatDialog,
    private externalAuthService: ExternalAuthService) {
    this.library.addIcons(faUtensils, faUser);
  }

  ngOnInit(): void {
    this.authService.authChanged$
      .subscribe({
        next: (value) => {
          this.isUserAuthenticated = value;
          const user = this.authService.getUser();
          this.username = user?.username;
          this.isUserAdmin = user?.isAdmin;
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
    if (localStorage.getItem("fbUser")) {
      this.externalAuthService.fbLogout();
    } else {
      this.authService.logout();
    }

    this.router.navigate(["/"]);
  }

}