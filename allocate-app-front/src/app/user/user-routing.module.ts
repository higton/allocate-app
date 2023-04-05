import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditUserComponent } from './edit-user/edit-user.component';
import { UserComponent } from './user/user.component';
import { authActivate } from '../auth/auth.guard';

const routes: Routes = [
  {path: 'editProfile', component: EditUserComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
