import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecipesMainComponent } from './recipes-main/recipes-main.component';
import { SharedModule } from '../shared/shared.module';
import { RecipesRoutingModule } from './recipes-routing.module';
import { RecipesMenuComponent } from './recipes-menu/recipes-menu.component';
import { RecipesListComponent } from './recipes-list/recipes-list.component';
import { RecipesDetailsComponent } from './recipes-details/recipes-details.component';
import { RecipesSubmitRecipeComponent } from './recipes-submit-recipe/recipes-submit-recipe.component';
import { RecipesViewComponent } from './recipes-view/recipes-view.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  declarations: [
    RecipesMainComponent,
    RecipesMenuComponent,
    RecipesListComponent,
    RecipesDetailsComponent,
    RecipesSubmitRecipeComponent,
    RecipesViewComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RecipesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule,
    MatCardModule,
    MatToolbarModule,
    NgxPaginationModule
  ],
  exports: [
    RecipesMenuComponent
  ],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false, showError: true }
    }
  ]
})
export class RecipesModule { }
