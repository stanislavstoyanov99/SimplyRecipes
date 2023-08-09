import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IRecipeDetails } from 'src/app/shared/interfaces/recipes/recipe-details';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faStar, faCalendarAlt, faUser, faClock, faUtensils, faFaceFrown } from '@fortawesome/free-solid-svg-icons';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from 'src/app/shared/error-dialog/error-dialog.component';
import { Difficulty } from 'src/app/shared/enums/difficulty';
import { rate } from 'src/app/shared/utils/utils';

@Component({
  selector: 'app-recipes-details',
  templateUrl: './recipes-details.component.html',
  styleUrls: ['./recipes-details.component.scss']
})
export class RecipesDetailsComponent implements OnInit {

  recipe: IRecipeDetails | null = null;
  isReviewAlreadyMade!: boolean;
  Difficulty = Difficulty;
  rate = rate;

  constructor(
    private activatedRoute: ActivatedRoute,
    private library: FaIconLibrary,
    private dialog: MatDialog) {
    this.library.addIcons(faStar, faCalendarAlt, faUser, faClock, faUtensils, faFaceFrown);
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe({
      next: ({ recipe }) => {
        this.recipe = recipe;
      },
      error: (err: string) => {
        this.dialog.open(ErrorDialogComponent, {
          data: {
            message: err
          }
        });
      }
    });

    this.isReviewAlreadyMade = this.recipe?.reviews.some(x => x.userId === this.recipe?.userId) || false;
  }
}
