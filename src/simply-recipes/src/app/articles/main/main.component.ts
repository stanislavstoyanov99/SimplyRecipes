import { Component, OnInit } from '@angular/core';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faCalendar, faUser } from '@fortawesome/free-solid-svg-icons';
import { ArticlesService } from 'src/app/services/articles.service';
import { IArticleListing } from 'src/app/shared/interfaces/article-listing';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  articles: IArticleListing[] | null = null;

  constructor(
    private articlesService: ArticlesService,
    private library: FaIconLibrary) {
      this.library.addIcons(faUser, faCalendar);
  }

  ngOnInit(): void {
    this.articlesService.getArticles().subscribe({
      next: (value) => {
        this.articles = value;
      },
      error: (err) => {
        console.error(err); // TODO: Add global error handler
      }
    });
  }
}
