import { RouterModule, Routes } from "@angular/router";
import { DetailsComponent } from "./details/details.component";
import { MainComponent } from "./main/main.component";
import { ArticleResolver } from "./resolvers/article.resolver";

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
    title: "Details"
  }
];

export const ArticlesRoutingModule = RouterModule.forChild(routes);