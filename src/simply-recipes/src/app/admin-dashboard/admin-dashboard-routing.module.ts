import { RouterModule, Routes } from "@angular/router";
import { MainComponent } from "./main/main.component";
import { CreateRecipeComponent } from "./create-recipe/create-recipe.component";
import { GetAllRecipesComponent } from "./get-all-recipes/get-all-recipes.component";
import { CreateArticleComponent } from "./create-article/create-article.component";
import { GetAllArticlesComponent } from "./get-all-articles/get-all-articles.component";
import { CreateCategoryComponent } from "./create-category/create-category.component";
import { GetAllCategoriesComponent } from "./get-all-categories/get-all-categories.component";
import { ListUsersComponent } from "./list-users/list-users.component";
import { CreateFaqComponent } from "./create-faq/create-faq.component";
import { GetAllFaqsComponent } from "./get-all-faqs/get-all-faqs.component";
import { CreatePrivacyComponent } from "./create-privacy/create-privacy.component";
import { EditPrivacyComponent } from "./edit-privacy/edit-privacy.component";

const routes: Routes = [
  {
    path: 'main',
    component: MainComponent,
    data: {
      title: 'Main'
    },
    children: [
        {
            path: 'create-recipe',
            component: CreateRecipeComponent,
            data: {
                title: 'Create Recipe'
            }
        },
        {
            path: 'recipes/get-all',
            component: GetAllRecipesComponent,
            data: {
                title: 'Get All Recipes'
            }
        },
        {
            path: 'create-article',
            component: CreateArticleComponent,
            data: {
                title: 'Create Article'
            }
        },
        {
            path: 'articles/get-all',
            component: GetAllArticlesComponent,
            data: {
                title: 'Get All Articles'
            }
        },
        {
            path: 'create-category',
            component: CreateCategoryComponent,
            data: {
                title: 'Create Category'
            }
        },
        {
            path: 'categories/get-all',
            component: GetAllCategoriesComponent,
            data: {
                title: 'Get All Categories'
            }
        },
        {
            path: 'users/list',
            component: ListUsersComponent,
            data: {
                title: 'List All Users'
            }
        },
        {
            path: 'create-faq',
            component: CreateFaqComponent,
            data: {
                title: 'Create Faq'
            }
        },
        {
            path: 'faqs/get-all',
            component: GetAllFaqsComponent,
            data: {
                title: 'Get All Faqs'
            }
        },
        {
            path: 'create-privacy',
            component: CreatePrivacyComponent,
            data: {
                title: 'Create Privacy'
            }
        },
        {
            path: 'edit-privacy',
            component: EditPrivacyComponent,
            data: {
                title: 'Edit Privacy'
            }
        }
    ]
  }
];

export const AdminDashboardRoutingModule = RouterModule.forChild(routes);