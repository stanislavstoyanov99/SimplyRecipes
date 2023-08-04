import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IArticleListing } from 'src/app/shared/interfaces/articles/article-listing';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faCalendar, faUser, faComments } from '@fortawesome/free-solid-svg-icons';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from 'src/app/shared/error-dialog/error-dialog.component';

@Component({
  selector: 'app-by-category',
  templateUrl: './by-category.component.html',
  styleUrls: ['./by-category.component.scss']
})
export class ByCategoryComponent implements OnInit {

  categoryName!: string;
  articlesByCategory!: IArticleListing[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private library: FaIconLibrary,
    private dialog: MatDialog) {
    this.library.addIcons(faUser, faCalendar, faComments);
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe({
      next: ({ articlesByCategory }) => {
        this.articlesByCategory = articlesByCategory;
      },
      error: (err: string) => {
        this.dialog.open(ErrorDialogComponent, {
          data: {
            message: err
          }
        });
      }
    });

    this.activatedRoute.queryParams.subscribe(params => {
      this.categoryName = params['categoryName'];
    });
  }

}
