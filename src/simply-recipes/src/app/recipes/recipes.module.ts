import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main/main.component';
import { SharedModule } from '../shared/shared.module';
import { RecipesRoutingModule } from './recipes-routing.module';
import { RecipesMenuComponent } from './recipes-menu/recipes-menu.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RecipesListComponent } from './recipes-list/recipes-list.component';
import { RecipesDetailsComponent } from './recipes-details/recipes-details.component';
import { SubmitRecipeComponent } from './submit-recipe/submit-recipe.component';
import { RecipesViewComponent } from './recipes-view/recipes-view.component';



@NgModule({
  declarations: [
    MainComponent,
    RecipesMenuComponent,
    RecipesListComponent,
    RecipesDetailsComponent,
    SubmitRecipeComponent,
    RecipesViewComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RecipesRoutingModule,
    FontAwesomeModule
  ],
  exports: [
    RecipesMenuComponent
  ]
})
export class RecipesModule { }
