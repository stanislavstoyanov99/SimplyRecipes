import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IRecipeDetails } from 'src/app/shared/interfaces/recipes/recipe-details';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faStar, faCalendarAlt, faUser, faClock, faUtensils, faFaceFrown, faTrash } from '@fortawesome/free-solid-svg-icons';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from 'src/app/shared/dialogs/error-dialog/error-dialog.component';
import { Difficulty } from 'src/app/shared/enums/difficulty';
import { rate } from 'src/app/shared/utils/utils';
import { CreateRecipeReviewDialogComponent, RecipeReviewDialogModel } from 'src/app/shared/dialogs/create-recipe-review-dialog/create-recipe-review-dialog.component';
import { ReviewsService } from 'src/app/services/reviews.service';
import { IUser } from 'src/app/shared/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { ConfirmDialogModel, ConfirmationDialogComponent } from 'src/app/shared/dialogs/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-recipes-details',
  templateUrl: './recipes-details.component.html',
  styleUrls: ['./recipes-details.component.scss']
})
export class RecipesDetailsComponent implements OnInit {

  recipe: IRecipeDetails | null = null;
  user: IUser | null = null;
  get isReviewAlreadyMade(): boolean {
    return this.recipe?.reviews.some(x => x.userId === this.user?.id) || false;
  }
  Difficulty = Difficulty;
  rate = rate;

  constructor(
    private activatedRoute: ActivatedRoute,
    private library: FaIconLibrary,
    private dialog: MatDialog,
    private reviewService: ReviewsService,
    private authService: AuthService) {
    this.library.addIcons(faStar, faCalendarAlt, faUser, faClock, faUtensils, faFaceFrown, faTrash);
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

    this.user = this.authService.getUser();
  }

  onCreateReviewHandler(recipeName: string | undefined, recipeId: number | undefined, recipeRate: number): void {
    const title = `Give Us your opinion for ${recipeName}`;
    const dialogData = new RecipeReviewDialogModel(title, recipeId, recipeRate);
    const dialogRef = this.dialog.open(CreateRecipeReviewDialogComponent, {
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(review => {
      if (review) {
        this.reviewService.submitReview(review).subscribe({
          next: (review) => {
            this.recipe!.reviews = [...this.recipe!.reviews, review];
            this.recipe!.rate = review.recipe.rate;
          },
          error: (err: string) => {
            this.dialog.open(ErrorDialogComponent, {
              data: { message: err }
            });
          }
        });  
      }
    });
  }

  onRemoveReviewHandler(reviewId: number): void {
    const message = 'Are you sure you want to delete this review?';
    const dialogData = new ConfirmDialogModel('Confirmation', message);
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.reviewService.removeReview(reviewId).subscribe({
          next: (newRate) => {
            const indexOfDeletedReview = this.recipe?.reviews.findIndex(x => x.id === reviewId);
            this.recipe?.reviews.splice(indexOfDeletedReview!, 1);
            this.recipe!.rate = newRate;
          },
          error: (err: string) => {
            this.dialog.open(ErrorDialogComponent, {
              data: { message: err }
            });
          }
        });
      }
    });
  }
}
