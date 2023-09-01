import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticlesMainComponent } from './articles-main/articles-main.component';
import { SharedModule } from '../shared/shared.module';
import { ArticlesRoutingModule } from './articles-routing.module';
import { ArticlesDetailsComponent } from './articles-details/articles-details.component';
import { FormsModule } from '@angular/forms';
import { ArticlesByCategoryComponent } from './articles-by-category/articles-by-category.component';
import { ArticlesMenuComponent } from './articles-menu/articles-menu.component';
import { ArticlesListComponent } from './articles-list/articles-list.component';
import { ArticlesCommentsComponent } from './articles-comments/articles-comments.component';
import { ArticlesSidebarComponent } from './articles-sidebar/articles-sidebar.component';
import { ArticlesSearchComponent } from './articles-search/articles-search.component';
import { NgxPaginationModule } from 'ngx-pagination';



@NgModule({
  declarations: [
    ArticlesMainComponent,
    ArticlesDetailsComponent,
    ArticlesByCategoryComponent,
    ArticlesMenuComponent,
    ArticlesListComponent,
    ArticlesCommentsComponent,
    ArticlesSidebarComponent,
    ArticlesSearchComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ArticlesRoutingModule,
    NgxPaginationModule
  ],
  exports: [
    ArticlesMenuComponent
  ]
})
export class ArticlesModule { }
