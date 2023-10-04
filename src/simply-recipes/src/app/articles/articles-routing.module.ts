import { RouterModule, Routes } from "@angular/router";
import { ArticlesByCategoryComponent } from "./articles-by-category/articles-by-category.component";
import { ArticlesDetailsComponent } from "./articles-details/articles-details.component";
import { ArticlesMainComponent } from "./articles-main/articles-main.component";
import { ArticleResolver } from "./resolvers/article.resolver";
import { ByCategoryResolver } from "./resolvers/by-category.resolver";
import { ArticlesSearchComponent } from "./articles-search/articles-search.component";

const routes: Routes = [
  {
    path: 'main',
    component: ArticlesMainComponent,
    data: {
      title: 'Articles'
    }
  },
  {
    path: 'details/:id',
    resolve: {
      article: ArticleResolver
    },
    component: ArticlesDetailsComponent,
    data: {
      title: 'Details'
    }
  },
  {
    path: 'by-category',
    resolve: {
      articlesByCategoryPaginated: ByCategoryResolver
    },
    component: ArticlesByCategoryComponent,
    data: {
      title: 'By Category'
    }
  },
  {
    path: 'search',
    component: ArticlesSearchComponent,
    data: {
      title: 'Search Results'
    }
  }
];

export const ArticlesRoutingModule = RouterModule.forChild(routes);