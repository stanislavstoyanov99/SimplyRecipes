import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArticlesService } from 'src/app/services/articles.service';
import { IArticleListing } from 'src/app/shared/interfaces/articles/article-listing';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faSearch, faCalendar } from '@fortawesome/free-solid-svg-icons';
import { ErrorDialogComponent } from 'src/app/shared/dialogs/error-dialog/error-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { PageResult } from 'src/app/shared/utils/utils';
import { LoadingService } from 'src/app/services/loading.service';
import { Location } from '@angular/common';
import { map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-articles-search',
  templateUrl: './articles-search.component.html',
  styleUrls: ['./articles-search.component.scss']
})
export class ArticlesSearchComponent implements OnInit {

  articlesPaginated: PageResult<IArticleListing> = {
    count: 0,
    items: [],
    pageNumber: 1,
    pageSize: 0
  };
  pageNumber: number = 1;
  pageSize: number = 5;
  count: number = 0;
  query!: string;

  constructor(
    public loadingService: LoadingService,
    private articlesService: ArticlesService,
    private route: ActivatedRoute,
    private library: FaIconLibrary,
    private dialog: MatDialog,
    private location: Location) {
      this.library.addIcons(faSearch, faCalendar);
  }

  ngOnInit(): void {
    this.route.queryParams.pipe(map(params => {
      this.query = params["query"];
      return this.query;
    }), mergeMap(query => this.articlesService.getArticlesBySearchQuery(query, this.pageNumber))).subscribe({
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

  onSearchHandler(query: string): void {
    if (query) {
      this.getArticlesPaginated(query, 1);
      this.location.go(`/articles/search?query=${query}&pageNumber=1`);
    }
  }

  onPageChange(pageNumber: number, query: string): void {
    this.getArticlesPaginated(query ? query : this.query, pageNumber);
    this.location.go(`/articles/search?query=${query ? query : this.query}&pageNumber=${pageNumber}`);
  }

  private getArticlesPaginated(query: string, pageNumber?: number) {
    this.articlesService.getArticlesBySearchQuery(query, pageNumber).subscribe({
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
