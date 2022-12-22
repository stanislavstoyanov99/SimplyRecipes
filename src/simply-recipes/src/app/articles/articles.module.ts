import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main/main.component';
import { SharedModule } from '../shared/shared.module';
import { ArticlesRoutingModule } from './articles-routing.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DetailsComponent } from './details/details.component';
import { FormsModule } from '@angular/forms';
import { ByCategoryComponent } from './by-category/by-category.component';



@NgModule({
  declarations: [
    MainComponent,
    DetailsComponent,
    ByCategoryComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ArticlesRoutingModule,
    FontAwesomeModule
  ]
})
export class ArticlesModule { }
