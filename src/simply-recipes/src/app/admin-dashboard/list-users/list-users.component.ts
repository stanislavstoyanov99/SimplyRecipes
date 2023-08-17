import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UsersService } from 'src/app/services/users.service';
import { ErrorDialogComponent } from 'src/app/shared/dialogs/error-dialog/error-dialog.component';
import { EditUserDialogModel, UserEditDialogComponent } from 'src/app/shared/dialogs/user-edit-dialog/user-edit-dialog.component';
import { Gender } from 'src/app/shared/enums/gender';
import { IUserDetails } from 'src/app/shared/interfaces/users/user-details';

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.scss']
})
export class ListUsersComponent implements OnInit {

  users: IUserDetails[] = [];
  Gender = Gender;

  constructor(
    private dialog: MatDialog,
    private usersService: UsersService) { }

  ngOnInit(): void {
    this.usersService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
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

  onEditHandler(user: IUserDetails): void {
    const title = `Edit Application User ${user.username} Role`;
    const dialogData = new EditUserDialogModel(title, user);
    const dialogRef = this.dialog.open(UserEditDialogComponent, {
      width: '50%',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(user => {
      if (user) {
        this.usersService.editUser(user).subscribe({
          next: (user) => {
            const indexOfUpdatedUser = this.users.findIndex(x => x.id === user.id);
            this.users[indexOfUpdatedUser] = user;
          },
          error: (err: string) => {
            this.dialog.open(ErrorDialogComponent, {
              data: { message: err }
            });
          }
        });
      }
    });
  }

}
