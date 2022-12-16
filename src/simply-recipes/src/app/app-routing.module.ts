import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactComponent } from './contact/contact.component';
import { FaqComponent } from './faq/faq.component';
import { HomeComponent } from './home/home.component';
import { PrivacyComponent } from './privacy/privacy.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HomeComponent,
    data: {
      title: 'Home'
    }
  },
  {
    path: 'privacy',
    component: PrivacyComponent,
    data: {
      title: 'Privacy'
    }
  },
  {
    path: 'contacts',
    component: ContactComponent,
    data: {
      title: 'Contacts'
    }
  },
  {
    path: 'faq',
    component: FaqComponent,
    data: {
      title: 'FAQ'
    }
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'recipes',
    loadChildren: () => import('./recipes/recipes.module').then(m => m.RecipesModule)
  },
  {
    path: 'articles',
    loadChildren: () => import('./articles/articles.module').then(m => m.ArticlesModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
