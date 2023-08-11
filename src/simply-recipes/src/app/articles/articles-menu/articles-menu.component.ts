import { Component, OnInit } from '@angular/core';
import { IArticleListing } from 'src/app/shared/interfaces/articles/article-listing';
import { HomeService } from 'src/app/services/home.service';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faUser, faCalendar } from '@fortawesome/free-solid-svg-icons';
import { LoadingService } from 'src/app/services/loading.service';
import { ErrorDialogComponent } from 'src/app/shared/dialogs/error-dialog/error-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-articles-menu',
  templateUrl: './articles-menu.component.html',
  styleUrls: ['./articles-menu.component.scss']
})
export class ArticlesMenuComponent implements OnInit {

  recentArticles: IArticleListing[] | null = null;

  constructor(
    public loadingService: LoadingService,
    private homeService: HomeService,
    private library: FaIconLibrary,
    private dialog: MatDialog) {
    this.library.addIcons(faUser, faCalendar);
   }

  ngOnInit(): void {
    this.homeService.getRecentArticles().subscribe({
      next: (recentArticles) => {
        this.recentArticles = recentArticles;
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
