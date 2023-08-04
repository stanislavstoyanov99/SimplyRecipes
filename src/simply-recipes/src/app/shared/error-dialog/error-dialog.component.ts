import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-error-dialog',
  templateUrl: './error-dialog.component.html',
  styleUrls: ['./error-dialog.component.scss'],
  standalone: true,
  imports: [MatButtonModule, MatDialogModule, MatIconModule]
})
export class ErrorDialogComponent {

  message!: string;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    private data: {
      message: string;
    }) {
      if (this.data?.message) {
        this.message = this.data.message;
      }
    }
}
