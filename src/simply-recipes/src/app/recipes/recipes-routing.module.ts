import { RouterModule, Routes } from "@angular/router";
import { MainComponent } from "./main/main.component";

const routes: Routes = [
  {
    path: 'main',
    component: MainComponent,
    data: {
      title: 'Recipes'
    }
  }
];

export const RecipesRoutingModule = RouterModule.forChild(routes);