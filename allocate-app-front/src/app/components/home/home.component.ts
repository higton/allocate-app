import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../auth/services/auth.service';
import { UserService } from '../../services/user.service';
import { Course } from 'src/app/models/Course';
import { Classroom } from 'src/app/models/Classroom';
import { ServerService } from 'src/app/auth/services/server.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {

  coursesList: Course[] = [];
  classroomsList: Classroom[] = [];
  results: any = { courses: [], classrooms: []};
  step: number = 0;

  constructor(public authService: AuthService, 
              public userService: UserService,
              public server: ServerService,
    ) {}

  ngOnInit(): void {
    this.getCourses();
    this.getClassrooms();
  }

  async getCourses(){
    let email:String = await this.authService.getEmail();

    this.classroomsList = await this.userService.getClassroomsFromAccount(email);
    this.coursesList = await this.userService.getCoursesFromAccount(email);
  }

  async getClassrooms(){
    let email:String = await this.authService.getEmail();

    await this.userService.getClassroomsFromAccount(email);
  }

  handleNextCourse(event: any) {

    this.results = {
      courses: this.coursesList,
      classrooms: this.classroomsList
    }

    this.step = 2;
  }

  handleNextClassroom(event: any) {
    this.step = 1;
  }
}
