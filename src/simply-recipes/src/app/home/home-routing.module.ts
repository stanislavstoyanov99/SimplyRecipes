import { RouterModule, Routes } from "@angular/router";
import { HomeMainComponent } from "./home-main/home-main.component";

const routes: Routes = [
  {
    path: '',
    component: HomeMainComponent,
    data: {
      title: 'Home'
    }
  }
];

export const HomeRoutingModule = RouterModule.forChild(routes);