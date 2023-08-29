import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArticlesService } from 'src/app/services/articles.service';
import { IArticleListing } from 'src/app/shared/interfaces/articles/article-listing';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faSearch, faCalendar } from '@fortawesome/free-solid-svg-icons';
import { ErrorDialogComponent } from 'src/app/shared/dialogs/error-dialog/error-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { PageResult } from 'src/app/shared/utils/utils';

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
  searchTitle!: string;

  constructor(
    private articlesService: ArticlesService,
    private route: ActivatedRoute,
    private library: FaIconLibrary,
    private dialog: MatDialog) {
      this.library.addIcons(faSearch, faCalendar);
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.searchTitle = params["searchTitle"];
    });

    this.getArticlesPaginated(this.searchTitle, 1);
  }

  onSearchHandler(value: string): void {
    if (value) {
      this.getArticlesPaginated(value, 1);
    }
  }

  onPageChange(pageNumber: number): void {
    this.getArticlesPaginated(this.searchTitle, pageNumber);
  }

  private getArticlesPaginated(searchTitle: string, pageNumber?: number) {
    this.articlesService.getArticlesBySearchTitle(searchTitle, pageNumber).subscribe({
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
