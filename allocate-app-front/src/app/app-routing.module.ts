import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { authActivate, authDeactivate } from './auth/auth.guard';
import { ClassroomsComponent } from './components/classrooms/classrooms.component';
import { CoursesComponent } from './courses/courses.component';

const routes: Routes = [
  { path: '', component: LoginComponent, canActivate: [authDeactivate]},
  { path: 'home', component: HomeComponent, canActivate: [authActivate],
    children: [
      { path: '', redirectTo: 'classrooms', pathMatch: 'full' },
      { path: 'classrooms', component: ClassroomsComponent, canActivate: [authActivate]},
      { path: 'courses', component: CoursesComponent, canActivate: [authActivate]},
    ]
  },
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
