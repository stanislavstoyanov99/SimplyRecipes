import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main/main.component';
import { AdminDashboardRoutingModule } from './admin-dashboard-routing.module';
import { NavigationComponent } from './navigation/navigation.component';
import { CreateRecipeComponent } from './create-recipe/create-recipe.component';
import { GetAllRecipesComponent } from './get-all-recipes/get-all-recipes.component';
import { CreateArticleComponent } from './create-article/create-article.component';
import { GetAllArticlesComponent } from './get-all-articles/get-all-articles.component';
import { CreateCategoryComponent } from './create-category/create-category.component';
import { GetAllCategoriesComponent } from './get-all-categories/get-all-categories.component';
import { ListUsersComponent } from './list-users/list-users.component';
import { CreateFaqComponent } from './create-faq/create-faq.component';
import { GetAllFaqsComponent } from './get-all-faqs/get-all-faqs.component';
import { CreatePrivacyComponent } from './create-privacy/create-privacy.component';
import { EditPrivacyComponent } from './edit-privacy/edit-privacy.component';
import { DeletePrivacyComponent } from './delete-privacy/delete-privacy.component';



@NgModule({
  declarations: [
    MainComponent,
    NavigationComponent,
    CreateRecipeComponent,
    GetAllRecipesComponent,
    CreateArticleComponent,
    GetAllArticlesComponent,
    CreateCategoryComponent,
    GetAllCategoriesComponent,
    ListUsersComponent,
    CreateFaqComponent,
    GetAllFaqsComponent,
    CreatePrivacyComponent,
    EditPrivacyComponent,
    DeletePrivacyComponent
  ],
  imports: [
    CommonModule,
    AdminDashboardRoutingModule
  ]
})
export class AdminDashboardModule { }
