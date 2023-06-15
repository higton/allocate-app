import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { authActivate, authDeactivate } from './auth/auth.guard';

import { AllocateComponent } from './components/allocate/allocate.component';
import { ClassroomsComponent } from './components/classrooms/classrooms.component';
import { CoursesComponent } from './courses/courses.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { SolutionComponent } from './components/solution/solution.component';

const routes: Routes = [
  { path: '', component: LoginComponent, canActivate: [authDeactivate]},
  { path: 'home', component: HomeComponent, canActivate: [authActivate],
    children: [
      { path: '', redirectTo: 'classrooms', pathMatch: 'full' },
      { path: 'classrooms', component: ClassroomsComponent, canActivate: [authActivate]},
      { path: 'courses', component: CoursesComponent, canActivate: [authActivate]},
      { path: 'allocate', component: AllocateComponent, canActivate: [authActivate],
      children: [
        { path: 'allocate/:id', component: SolutionComponent, canActivate: [authActivate]},
      ]},
      { path: 'allocate/:id', component: SolutionComponent, canActivate: [authActivate]},
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
