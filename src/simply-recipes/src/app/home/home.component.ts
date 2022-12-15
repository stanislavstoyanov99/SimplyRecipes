import { Component, OnInit } from '@angular/core';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { HomeService } from 'src/app/services/home.service';
import { IRecipeListing } from 'src/app/shared/interfaces/recipe-listing';
import { faListAlt } from '@fortawesome/free-regular-svg-icons';
import { faStar, faUser, faCalendar } from '@fortawesome/free-solid-svg-icons';
import { IArticleListing } from 'src/app/shared/interfaces/article-listing';
import { IGallery } from 'src/app/shared/interfaces/gallery';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  topRecipes: IRecipeListing[] | null = null;
  recentArticles: IArticleListing[] | null = null;
  gallery: IGallery[] | null = null;
  
  slides: Array<object> = [];
  public isUserAuthenticated!: boolean;

  constructor(
    private homeService: HomeService,
    private library: FaIconLibrary,
    private authService: AuthService) {
    this.library.addIcons(faListAlt, faStar, faUser, faCalendar);
  }

  ngOnInit(): void {
    this.authService.authChanged
      .subscribe({
        next: (value) => {
          this.isUserAuthenticated = value;
        },
        error: (err) => {
          console.error(err); // TODO: Add global error handler
        }
    });
    
    this.homeService.getTopRecipes().subscribe({
      next: (value) => {
        this.topRecipes = value;
      },
      error: (err) => {
        console.error(err); // TODO: Add global error handler
      }
    });

    this.homeService.getRecentArticles().subscribe({
      next: (value) => {
        this.recentArticles = value;
      },
      error: (err) => {
        console.error(err); // TODO: Add global error handler
      }
    });

    this.homeService.getGallery().subscribe({
      next: (value) => {
        this.gallery = value;
        this.slides = this.gallery.map(value => {
          return {
            image: value.imagePath,
            thumbImage: value.imagePath
          }
        });
      },
      error: (err) => {
        console.error(err); // TODO: Add global error handler
      }
    });
  }

  rate(i: number) {
    return new Array(i);
  }
  
}
