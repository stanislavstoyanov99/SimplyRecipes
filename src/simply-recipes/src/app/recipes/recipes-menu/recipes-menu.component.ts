import { Component, OnInit } from '@angular/core';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { IRecipeListing } from 'src/app/shared/interfaces/recipes/recipe-listing';
import { HomeService } from 'src/app/services/home.service';
import { faListAlt } from '@fortawesome/free-regular-svg-icons';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { LoadingService } from 'src/app/services/loading.service';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from 'src/app/shared/error-dialog/error-dialog.component';
import { rate } from 'src/app/shared/utils/utils';

@Component({
  selector: 'app-recipes-menu',
  templateUrl: './recipes-menu.component.html',
  styleUrls: ['./recipes-menu.component.scss']
})
export class RecipesMenuComponent implements OnInit {

  topRecipes: IRecipeListing[] | null = null;
  rate = rate;

  constructor(
    public loadingService: LoadingService,
    private homeService: HomeService,
    private library: FaIconLibrary,
    private dialog: MatDialog) {
    this.library.addIcons(faListAlt, faStar);
  }

  ngOnInit(): void {
    this.homeService.getTopRecipes().subscribe({
      next: (topRecipes) => {
        this.topRecipes = topRecipes;
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
