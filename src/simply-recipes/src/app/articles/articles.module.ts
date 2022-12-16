import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main/main.component';
import { SharedModule } from '../shared/shared.module';
import { ArticlesRoutingModule } from './articles-routing.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';



@NgModule({
  declarations: [
    MainComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ArticlesRoutingModule,
    FontAwesomeModule
  ]
})
export class ArticlesModule { }
