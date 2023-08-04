import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArticlesService } from 'src/app/services/articles.service';
import { IArticleListing } from 'src/app/shared/interfaces/articles/article-listing';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faSearch, faCalendar } from '@fortawesome/free-solid-svg-icons';
import { ErrorDialogComponent } from 'src/app/shared/error-dialog/error-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-articles-search',
  templateUrl: './articles-search.component.html',
  styleUrls: ['./articles-search.component.scss']
})
export class ArticlesSearchComponent implements OnInit {

  articles: IArticleListing[] = [];
  searchTitle!: string;

  constructor(
    private articlesService: ArticlesService,
    private route: ActivatedRoute,
    private library: FaIconLibrary,
    private dialog: MatDialog) {
      this.library.addIcons(faSearch, faCalendar);
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.searchTitle = params["searchTitle"];
    });

    this.articlesService.getArticlesBySearchTitle(this.searchTitle).subscribe({
      next: (articles) => {
        this.articles = articles;
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

  onSearchHandler(value: string): void {
    if (value) {
      this.articlesService.getArticlesBySearchTitle(value).subscribe({
        next: (value) => {
          this.articles = value;
        },
        error: (err) => {
          console.error(err); // TODO: Add global error handler
        }
      });
    }
  }
}
