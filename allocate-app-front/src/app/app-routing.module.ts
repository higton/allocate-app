import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { authActivate, authDeactivate } from './auth/auth.guard';

const routes: Routes = [
  { path: '', component: LoginComponent, canActivate: [authDeactivate]},
  { path: 'home', component: HomeComponent, canActivate: [authActivate]},
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
    }),
    ],

  exports: [
    RouterModule,
    BrowserAnimationsModule,
  ]
})
export class AppRoutingModule { }
