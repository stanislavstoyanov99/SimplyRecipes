import { NgModule } from '@angular/core';
import { HomeMainComponent } from './home-main/home-main.component';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { HomeRoutingModule } from './home-routing.module';
import { RecipesModule } from '../recipes/recipes.module';
import { ArticlesModule } from '../articles/articles.module';
import { CalorieCalculatorComponent } from './calorie-calculator/calorie-calculator.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    HomeMainComponent,
    CalorieCalculatorComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    HomeRoutingModule,
    RecipesModule,
    ArticlesModule,
    FormsModule
  ]
})
export class HomeModule { }
