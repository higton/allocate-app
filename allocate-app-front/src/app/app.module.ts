import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/layout/header/header.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { HomeComponent } from './components/home/home.component';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CoursesComponent } from './courses/courses.component';
import { ClassroomsComponent } from './components/classrooms/classrooms.component';
import { TimetableComponent } from './components/timetable/timetable.component';
import { CourseClassroomEditComponent } from './components/course-classroom-edit/course-classroom-edit.component';
import { CourseInputComponent } from './components/course-input/course-input.component';
import { AllocateComponent } from './components/allocate/allocate.component';
import { SolutionTimetableComponent } from './components/solution-timetable/solution-timetable.component';
import { SolutionComponent } from './components/solution/solution.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    PageNotFoundComponent,
    HomeComponent,
    CoursesComponent,
    ClassroomsComponent,
    TimetableComponent,
    CourseClassroomEditComponent,
    CourseInputComponent,
    AllocateComponent,
    SolutionTimetableComponent,
    SolutionComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AuthModule,
    UserModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
