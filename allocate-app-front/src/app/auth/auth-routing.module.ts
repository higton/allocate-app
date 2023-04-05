import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SigninComponent } from './signin/signin.component';
import { authDeactivate } from '../auth/auth.guard';


const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [authDeactivate]},  
  { path: 'signup', component: SigninComponent, canActivate: [authDeactivate]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
