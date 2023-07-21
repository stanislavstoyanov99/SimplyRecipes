import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IRecipeDetails } from 'src/app/shared/interfaces/recipes/recipe-details';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faStar, faCalendarAlt, faUser, faClock, faUtensils } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-recipes-details',
  templateUrl: './recipes-details.component.html',
  styleUrls: ['./recipes-details.component.scss']
})
export class RecipesDetailsComponent implements OnInit {

  recipe: IRecipeDetails | null = null;
  isReviewAlreadyMade!: boolean;

  constructor(private activatedRoute: ActivatedRoute, private library: FaIconLibrary) {
    this.library.addIcons(faStar, faCalendarAlt, faUser, faClock, faUtensils);
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ recipe }) => {
      this.recipe = recipe;
    });
    this.isReviewAlreadyMade = this.recipe?.reviews.some(x => x.userId === this.recipe?.userId) || false;
  }

  rate(i?: number): Array<number> {
    return new Array(i);
  }
}
