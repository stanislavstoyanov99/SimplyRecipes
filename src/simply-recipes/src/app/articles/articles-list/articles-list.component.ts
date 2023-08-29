import { Component, OnInit } from '@angular/core';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { ArticlesService } from 'src/app/services/articles.service';
import { IArticleListing } from 'src/app/shared/interfaces/articles/article-listing';
import { faCalendar, faUser } from '@fortawesome/free-solid-svg-icons';
import { LoadingService } from 'src/app/services/loading.service';
import { ErrorDialogComponent } from 'src/app/shared/dialogs/error-dialog/error-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { PageResult } from 'src/app/shared/utils/utils';

@Component({
  selector: 'app-articles-list',
  templateUrl: './articles-list.component.html',
  styleUrls: ['./articles-list.component.scss']
})
export class ArticlesListComponent implements OnInit {

  articlesPaginated: PageResult<IArticleListing> = {
    count: 0,
    items: [],
    pageNumber: 1,
    pageSize: 0
  };
  pageNumber: number = 1;
  pageSize: number = 9;
  count: number = 0;
  
  constructor(
    public loadingService: LoadingService,
    private articlesService: ArticlesService,
    private library: FaIconLibrary,
    private dialog: MatDialog) {
      this.library.addIcons(faUser, faCalendar);
  }

  ngOnInit(): void {
    this.getArticlesPaginated(1);
  }

  onPageChange(pageNumber: number): void {
    this.getArticlesPaginated(pageNumber);
  }

  getArticlesPaginated(pageNumber?: number) {
    this.articlesService.getArticles(pageNumber).subscribe({
      next: (articlesPaginated) => {
        this.articlesPaginated = articlesPaginated;
        this.pageNumber = this.articlesPaginated.pageNumber;
        this.count = this.articlesPaginated.count;
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
