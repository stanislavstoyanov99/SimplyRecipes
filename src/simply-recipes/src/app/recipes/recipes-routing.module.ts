import { RouterModule, Routes } from "@angular/router";
import { RecipesMainComponent } from "./recipes-main/recipes-main.component";
import { RecipesDetailsComponent } from "./recipes-details/recipes-details.component";
import { RecipeResolver } from "./resolvers/recipe.resolver";
import { RecipesSubmitRecipeComponent } from "./recipes-submit-recipe/recipes-submit-recipe.component";
import { RecipesViewComponent } from "./recipes-view/recipes-view.component";

const routes: Routes = [
  {
    path: 'all',
    component: RecipesMainComponent,
    data: {
      title: 'Recipes'
    }
  },
  {
    path: 'details/:id',
    component: RecipesDetailsComponent,
    data: {
      title: 'Details'
    },
    resolve: {
      recipe: RecipeResolver
    }
  },
  {
    path: 'submit',
    component: RecipesSubmitRecipeComponent,
    data: {
      title: 'Submit Recipe'
    }
  },
  {
    path: 'view',
    component: RecipesViewComponent,
    data: {
      title: 'View Own Recipes'
    }
  }
];

export const RecipesRoutingModule = RouterModule.forChild(routes);