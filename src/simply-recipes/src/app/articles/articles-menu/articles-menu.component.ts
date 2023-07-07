import { Component, OnInit } from '@angular/core';
import { IArticleListing } from 'src/app/shared/interfaces/articles/article-listing';
import { HomeService } from 'src/app/services/home.service';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faUser, faCalendar } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-articles-menu',
  templateUrl: './articles-menu.component.html',
  styleUrls: ['./articles-menu.component.scss']
})
export class ArticlesMenuComponent implements OnInit {

  recentArticles: IArticleListing[] | null = null;

  constructor(private homeService: HomeService, private library: FaIconLibrary) {
    this.library.addIcons(faUser, faCalendar);
   }

  ngOnInit(): void {
    this.homeService.getRecentArticles().subscribe({
      next: (value) => {
        this.recentArticles = value;
      },
      error: (err) => {
        console.error(err); // TODO: Add global error handler
      }
    });
  }

}
