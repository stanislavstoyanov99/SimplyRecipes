import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main/main.component';
import { SharedModule } from '../shared/shared.module';
import { ArticlesRoutingModule } from './articles-routing.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DetailsComponent } from './details/details.component';
import { FormsModule } from '@angular/forms';
import { ByCategoryComponent } from './by-category/by-category.component';
import { ArticlesMenuComponent } from './articles-menu/articles-menu.component';
import { ArticlesListComponent } from './articles-list/articles-list.component';
import { ArticlesCommentsComponent } from './articles-comments/articles-comments.component';
import { ArticlesSidebarComponent } from './articles-sidebar/articles-sidebar.component';



@NgModule({
  declarations: [
    MainComponent,
    DetailsComponent,
    ByCategoryComponent,
    ArticlesMenuComponent,
    ArticlesListComponent,
    ArticlesCommentsComponent,
    ArticlesSidebarComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ArticlesRoutingModule,
    FontAwesomeModule
  ],
  exports: [
    ArticlesMenuComponent
  ]
})
export class ArticlesModule { }
