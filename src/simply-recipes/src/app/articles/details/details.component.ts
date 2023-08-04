import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faCalendar, faUser, faList } from '@fortawesome/free-solid-svg-icons';
import { ErrorDialogComponent } from 'src/app/shared/error-dialog/error-dialog.component';
import { IArticleListing } from 'src/app/shared/interfaces/articles/article-listing';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

  article!: IArticleListing;

  constructor(
    private library: FaIconLibrary,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog) {
    this.library.addIcons(faUser, faCalendar, faList);
   }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe({
      next: ({ article }) => {
        this.article = article;
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
