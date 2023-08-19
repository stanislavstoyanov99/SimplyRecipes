import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { IUserDetails } from '../../interfaces/users/user-details';
import { Gender } from '../../enums/gender';

@Component({
  selector: 'app-ban-dialog',
  templateUrl: './ban-dialog.component.html',
  styleUrls: ['./ban-dialog.component.scss'],
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    CommonModule,
    MatInputModule,
    ReactiveFormsModule]
})
export class BanDialogComponent {

  title: string;
  user: IUserDetails;
  formGroup: FormGroup;
  roles: string[] = [];
  Gender = Gender;

  constructor(
    public dialogRef: MatDialogRef<BanDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: BanUserDialogModel,
    private formBuilder: FormBuilder) {
      this.title = data.title;
      this.user = data.user;
      this.formGroup = this.createForm();
  }

  onConfirm(): void {
    this.dialogRef.close(this.user);
  }

  createForm(): FormGroup {
    this.formGroup = this.formBuilder.group({
      username: [this.user.username],
      gender: [Gender[this.user.gender]],
      createdOn: [this.user.createdOn]
    });
    return this.formGroup;
  }

  onDismiss(): void {
    this.dialogRef.close(null);
  }

}

export class BanUserDialogModel {
  constructor(public title: string, public user: IUserDetails) {}
}