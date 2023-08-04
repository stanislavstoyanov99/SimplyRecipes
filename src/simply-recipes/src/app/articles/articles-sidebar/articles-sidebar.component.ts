import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faCalendar, faUser, faSearch } from '@fortawesome/free-solid-svg-icons';
import { ArticlesService } from 'src/app/services/articles.service';
import { ErrorDialogComponent } from 'src/app/shared/error-dialog/error-dialog.component';
import { IArticleSidebar } from 'src/app/shared/interfaces/articles/article-sidebar';

@Component({
  selector: 'app-articles-sidebar',
  templateUrl: './articles-sidebar.component.html',
  styleUrls: ['./articles-sidebar.component.scss']
})
export class ArticlesSidebarComponent implements OnInit {

  sidebar: IArticleSidebar | null = null;

  constructor(
    private library: FaIconLibrary,
    private articlesService: ArticlesService,
    private router: Router,
    private dialog: MatDialog) {
    this.library.addIcons(faUser, faCalendar, faSearch);
  }
  
  ngOnInit(): void {
    this.articlesService.getArticleSidebar().subscribe({
      next: (sidebar) => {
        this.sidebar = sidebar;
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
      this.router.navigate(['/articles/search'], { queryParams: { searchTitle: value }});
    }
  }
}
