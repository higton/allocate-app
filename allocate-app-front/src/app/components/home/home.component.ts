import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../auth/services/auth.service';
import { UserService } from '../../services/user.service';
import { Course } from 'src/app/models/Course';
import { Classroom } from 'src/app/models/Classroom';
import { ServerService } from 'src/app/auth/services/server.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  coursesList: Course[] = [];
  classroomsList: Classroom[] = [];
  results: any = { courses: [], classrooms: []};

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

    this.coursesList = await this.userService.getCoursesFromAccount(email);
  }

  async getClassrooms(){
    let email:String = await this.authService.getEmail();

    this.classroomsList = await this.userService.getClassroomsFromAccount(email);
  }

  handleNextCourse(event: any) {
    // print to console to show that the event was emitted
    console.log('next button clicked');
  }

  handleNextClassroom(event: any) {
    // print to console to show that the event was emitted
    console.log('next button clicked');
    
    // push to results the list of courses and classrooms
    this.results = {
      courses: this.coursesList,
      classrooms: this.classroomsList
    }

    // print results beautifully
    console.log(JSON.stringify(this.results, null, 2));
  }
}
