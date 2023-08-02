import { Component, OnInit } from '@angular/core';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { IRecipeListing } from 'src/app/shared/interfaces/recipes/recipe-listing';
import { HomeService } from 'src/app/services/home.service';
import { faListAlt } from '@fortawesome/free-regular-svg-icons';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-recipes-menu',
  templateUrl: './recipes-menu.component.html',
  styleUrls: ['./recipes-menu.component.scss']
})
export class RecipesMenuComponent implements OnInit {

  topRecipes: IRecipeListing[] | null = null;

  constructor(
    public loadingService: LoadingService,
    private homeService: HomeService,
    private library: FaIconLibrary) {
    this.library.addIcons(faListAlt, faStar);
  }

  ngOnInit(): void {
    this.homeService.getTopRecipes().subscribe({
      next: (value) => {
        this.topRecipes = value;
      },
      error: (err) => {
        console.error(err); // TODO: Add global error handler
      }
    });
  }

  rate(i: number): Array<number> {
    return new Array(i);
  }
}
