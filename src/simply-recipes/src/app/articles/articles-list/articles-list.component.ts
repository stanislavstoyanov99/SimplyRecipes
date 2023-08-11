import { Component, OnInit } from '@angular/core';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { ArticlesService } from 'src/app/services/articles.service';
import { IArticleListing } from 'src/app/shared/interfaces/articles/article-listing';
import { faCalendar, faUser } from '@fortawesome/free-solid-svg-icons';
import { LoadingService } from 'src/app/services/loading.service';
import { ErrorDialogComponent } from 'src/app/shared/dialogs/error-dialog/error-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-articles-list',
  templateUrl: './articles-list.component.html',
  styleUrls: ['./articles-list.component.scss']
})
export class ArticlesListComponent implements OnInit {

  articles: IArticleListing[] = [];
  
  constructor(
    public loadingService: LoadingService,
    private articlesService: ArticlesService,
    private library: FaIconLibrary,
    private dialog: MatDialog) {
      this.library.addIcons(faUser, faCalendar);
  }

  ngOnInit(): void {
    this.articlesService.getArticles().subscribe({
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

}
