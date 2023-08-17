import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { IUserDetails } from '../../interfaces/users/user-details';
import { UserEditModel } from '../../models/user-edit';
import { MatRadioModule } from '@angular/material/radio';

@Component({
  selector: 'app-user-edit-dialog',
  templateUrl: './user-edit-dialog.component.html',
  styleUrls: ['./user-edit-dialog.component.scss'],
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    CommonModule,
    MatInputModule,
    ReactiveFormsModule,
    MatRadioModule]
})
export class UserEditDialogComponent {

  title: string;
  user: IUserDetails;
  formGroup: FormGroup;
  roles: string[] = [];

  constructor(public dialogRef: MatDialogRef<UserEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EditUserDialogModel,
    private formBuilder: FormBuilder) {
      this.title = data.title;
      this.user = data.user;
      this.formGroup = this.createForm();
  }

  onConfirm(formGroup: FormGroup): void {
    if (formGroup.invalid) { return; }

    const { newRole } = formGroup.value;
    const userEditModel = new UserEditModel();
    userEditModel.newRole = newRole;
    userEditModel.roleName = this.user.role;
    userEditModel.userId = this.user.id;

    this.dialogRef.close(userEditModel);
  }

  createForm(): FormGroup {
    this.formGroup = this.formBuilder.group({
      newRole: [this.user.role, [Validators.required]],
    });
    return this.formGroup;
  }

  onDismiss(): void {
    this.dialogRef.close(null);
  }

}

export class EditUserDialogModel {
  constructor(public title: string, public user: IUserDetails) {}
}
