import { RouterModule, Routes } from "@angular/router";
import { ContactsComponent } from "./contacts/contacts.component";

const routes: Routes = [
  {
    path: 'contacts',
    component: ContactsComponent
  }
];

export const SharedRoutingModule = RouterModule.forChild(routes);