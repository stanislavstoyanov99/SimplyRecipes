import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main/main.component';
import { SharedModule } from '../shared/shared.module';
import { RecipesRoutingModule } from './recipes-routing.module';
import { RecipesMenuComponent } from './recipes-menu/recipes-menu.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';



@NgModule({
  declarations: [
    MainComponent,
    RecipesMenuComponent
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
