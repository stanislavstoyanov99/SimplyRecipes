import { RouterModule, Routes } from "@angular/router";
import { MainComponent } from "./main/main.component";

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    data: {
      title: 'Home'
    }
  }
];

export const HomeRoutingModule = RouterModule.forChild(routes);