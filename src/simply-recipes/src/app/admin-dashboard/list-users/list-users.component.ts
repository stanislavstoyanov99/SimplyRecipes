import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UsersService } from 'src/app/services/users.service';
import { ErrorDialogComponent } from 'src/app/shared/dialogs/error-dialog/error-dialog.component';
import { IUserDetails } from 'src/app/shared/interfaces/users/user-details';

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.scss']
})
export class ListUsersComponent implements OnInit {

  users: IUserDetails[] = [];

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

}
