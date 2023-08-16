import { RouterModule, Routes } from "@angular/router";
import { MainComponent } from "./main/main.component";
import { RecipesDetailsComponent } from "./recipes-details/recipes-details.component";
import { RecipeResolver } from "./resolvers/recipe.resolver";
import { SubmitRecipeComponent } from "./submit-recipe/submit-recipe.component";
import { RecipesViewComponent } from "./recipes-view/recipes-view.component";

const routes: Routes = [
  {
    path: 'main',
    component: MainComponent,
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
    component: SubmitRecipeComponent,
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
  },
];

export const RecipesRoutingModule = RouterModule.forChild(routes);