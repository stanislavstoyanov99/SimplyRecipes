import { RouterModule, Routes } from "@angular/router";
import { MainComponent } from "./main/main.component";
import { RecipesDetailsComponent } from "./recipes-details/recipes-details.component";
import { RecipeResolver } from "./resolvers/recipe.resolver";

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
    },
  },
  {
    path: 'by-category',
    component: MainComponent,
    data: {
      title: 'By Category'
    }
  },
];

export const RecipesRoutingModule = RouterModule.forChild(routes);