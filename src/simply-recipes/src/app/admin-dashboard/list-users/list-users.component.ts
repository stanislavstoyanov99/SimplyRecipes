import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';
import { BanDialogComponent, BanUserDialogModel } from 'src/app/shared/dialogs/ban-dialog/ban-dialog.component';
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
    private usersService: UsersService,
    private router: Router) { }

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

  onBanHandler(user: IUserDetails): void {
    const title = `Are you sure you want to ban user ${user.username} ?`;
    const dialogData = new BanUserDialogModel(title, user);
    const dialogRef = this.dialog.open(BanDialogComponent, {
      width: '50%',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.usersService.banUser(user.id).subscribe({
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

  onUnbanHandler(user: IUserDetails): void {
    const title = `Are you sure you want to unban user ${user.username} ?`;
    const dialogData = new BanUserDialogModel(title, user);
    const dialogRef = this.dialog.open(BanDialogComponent, {
      width: '50%',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.usersService.unbanUser(user.id).subscribe({
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
