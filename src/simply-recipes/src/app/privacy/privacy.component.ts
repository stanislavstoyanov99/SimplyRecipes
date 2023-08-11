import { Component, OnInit } from '@angular/core';
import { HomeService } from '../services/home.service';
import { IPrivacy } from '../shared/interfaces/privacy/privacy';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from '../shared/dialogs/error-dialog/error-dialog.component';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.scss']
})
export class PrivacyComponent implements OnInit {

  privacy: IPrivacy | null = null;

  constructor(private homeService: HomeService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.homeService.getPrivacy().subscribe({
      next: (privacy) => {
        this.privacy = privacy;
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
