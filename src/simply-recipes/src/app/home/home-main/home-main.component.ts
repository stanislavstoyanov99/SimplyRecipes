import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { ErrorDialogComponent } from 'src/app/shared/dialogs/error-dialog/error-dialog.component';

@Component({
  selector: 'app-home-main',
  templateUrl: './home-main.component.html',
  styleUrls: ['./home-main.component.scss']
})
export class HomeMainComponent implements OnInit {

  public isUserAuthenticated!: boolean;
  slides: number[] = [];
  constructor(private authService: AuthService, private dialog: MatDialog) {
    this.slides = Array.from(Array(10).keys());
  }

  ngOnInit(): void {
    this.authService.authChanged$
      .subscribe({
        next: (value) => {
          this.isUserAuthenticated = value;
        },
        error: (err: string) => {
          this.dialog.open(ErrorDialogComponent, {
            data: {
              message: err
            }
          });
        }
    });
  }
}
