import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UsersService } from 'src/app/services/users.service';
import { BanDialogComponent, BanUserDialogModel } from 'src/app/shared/dialogs/ban-dialog/ban-dialog.component';
import { ErrorDialogComponent } from 'src/app/shared/dialogs/error-dialog/error-dialog.component';
import { EditUserDialogModel, UserEditDialogComponent } from 'src/app/shared/dialogs/user-edit-dialog/user-edit-dialog.component';
import { Gender } from 'src/app/shared/enums/gender';
import { IUserDetails } from 'src/app/shared/interfaces/users/user-details';
import { PageResult } from 'src/app/shared/utils/utils';

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.scss']
})
export class ListUsersComponent implements OnInit {

  usersPaginated: PageResult<IUserDetails> = {
    count: 0,
    items: [],
    pageNumber: 1,
    pageSize: 0
  }
  pageNumber: number = 1;
  pageSize: number = 10;
  count: number = 0;
  Gender = Gender;

  constructor(
    private dialog: MatDialog,
    private usersService: UsersService,
    private location: Location) { }

  ngOnInit(): void {
    this.getUsersPaginated(1);
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
            const indexOfUpdatedUser = this.usersPaginated.items.findIndex(x => x.id === user.id);
            this.usersPaginated.items[indexOfUpdatedUser] = user;
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
            const indexOfUpdatedUser = this.usersPaginated.items.findIndex(x => x.id === user.id);
            this.usersPaginated.items[indexOfUpdatedUser] = user;
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
            const indexOfUpdatedUser = this.usersPaginated.items.findIndex(x => x.id === user.id);
            this.usersPaginated.items[indexOfUpdatedUser] = user;
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

  onPageChange(pageNumber: number): void {
    this.getUsersPaginated(pageNumber);
  }

  private getUsersPaginated(pageNumber?: number) {
    this.usersService.getAllUsers(pageNumber).subscribe({
      next: (usersPaginated) => {
        this.location.go(`/admin-dashboard/main/users/list?pageNumber=${pageNumber}`);
        this.usersPaginated = usersPaginated;
        this.pageNumber = this.usersPaginated.pageNumber;
        this.count = this.usersPaginated.count;
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
