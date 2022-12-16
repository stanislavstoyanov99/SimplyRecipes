import { Component, OnInit } from '@angular/core';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faListAlt } from '@fortawesome/free-regular-svg-icons';
import { faStar, faUser, faCalendar } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from 'src/app/services/auth.service';
import { HomeService } from 'src/app/services/home.service';
import { IArticleListing } from 'src/app/shared/interfaces/article-listing';
import { IGallery } from 'src/app/shared/interfaces/gallery';
import { IRecipeListing } from 'src/app/shared/interfaces/recipe-listing';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

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
