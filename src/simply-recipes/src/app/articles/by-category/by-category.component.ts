import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IArticleListing } from 'src/app/shared/interfaces/articles/article-listing';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faCalendar, faUser, faComments } from '@fortawesome/free-solid-svg-icons';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from 'src/app/shared/dialogs/error-dialog/error-dialog.component';
import { PageResult } from 'src/app/shared/utils/utils';
import { ArticlesService } from 'src/app/services/articles.service';

@Component({
  selector: 'app-by-category',
  templateUrl: './by-category.component.html',
  styleUrls: ['./by-category.component.scss']
})
export class ByCategoryComponent implements OnInit {

  categoryName!: string;
  articlesByCategoryPaginated: PageResult<IArticleListing> = {
    count: 0,
    items: [],
    pageNumber: 1,
    pageSize: 0
  };
  pageNumber: number = 1;
  pageSize: number = 6;
  count: number = 0;

  constructor(
    private activatedRoute: ActivatedRoute,
    private library: FaIconLibrary,
    private dialog: MatDialog,
    private articlesService: ArticlesService) {
    this.library.addIcons(faUser, faCalendar, faComments);
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe({
      next: ({ articlesByCategoryPaginated }) => {
        this.articlesByCategoryPaginated = articlesByCategoryPaginated;
        this.pageNumber = this.articlesByCategoryPaginated.pageNumber;
        this.count = this.articlesByCategoryPaginated.count;
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

  onPageChange(pageNumber: number): void {
    this.articlesService.getArticlesByCategoryName(this.categoryName, pageNumber).subscribe({
      next: (articlesByCategoryPaginated) => {
        this.articlesByCategoryPaginated = articlesByCategoryPaginated;
        this.pageNumber = this.articlesByCategoryPaginated.pageNumber;
        this.count = this.articlesByCategoryPaginated.count;
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
