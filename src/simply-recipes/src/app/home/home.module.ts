import { NgModule } from '@angular/core';
import { MainComponent } from './main/main.component';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { HomeRoutingModule } from './home-routing.module';
import { RecipesModule } from '../recipes/recipes.module';
import { ArticlesModule } from '../articles/articles.module';



@NgModule({
  declarations: [
    MainComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    HomeRoutingModule,
    RecipesModule,
    ArticlesModule
  ]
})
export class HomeModule { }
