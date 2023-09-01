import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faCalendar, faUser, faList } from '@fortawesome/free-solid-svg-icons';
import { ErrorDialogComponent } from 'src/app/shared/dialogs/error-dialog/error-dialog.component';
import { IArticleListing } from 'src/app/shared/interfaces/articles/article-listing';

@Component({
  selector: 'app-articles-details',
  templateUrl: './articles-details.component.html',
  styleUrls: ['./articles-details.component.scss']
})
export class ArticlesDetailsComponent implements OnInit {

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
