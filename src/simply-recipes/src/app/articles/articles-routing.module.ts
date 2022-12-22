import { RouterModule, Routes } from "@angular/router";
import { ByCategoryComponent } from "./by-category/by-category.component";
import { DetailsComponent } from "./details/details.component";
import { MainComponent } from "./main/main.component";
import { ArticleResolver } from "./resolvers/article.resolver";
import { ByCategoryResolver } from "./resolvers/by-category.resolver";

const routes: Routes = [
  {
    path: 'main',
    component: MainComponent,
    data: {
      title: 'Articles'
    }
  },
  {
    path: 'details/:id',
    resolve: {
      article: ArticleResolver
    },
    component: DetailsComponent,
    data: {
      title: 'Details'
    }
  },
  {
    path: 'by-category',
    resolve: {
      articlesByCategory: ByCategoryResolver
    },
    component: ByCategoryComponent,
    data: {
      title: 'By Category'
    }
  }
];

export const ArticlesRoutingModule = RouterModule.forChild(routes);