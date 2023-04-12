import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../auth/services/auth.service';
import { Course } from 'src/app/models/Course';
import { Classroom } from 'src/app/models/Classroom';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  coursesList: Course[] = [];
  classroomsList: Classroom[] = [];

  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    this.getCourses();
    this.getClassrooms();
  }

  async getCourses(){
    let email:String = await this.authService.getEmail();

    this.coursesList = await this.authService.getCoursesFromAccount(email);
  }

  async getClassrooms(){
    let email:String = await this.authService.getEmail();

    this.classroomsList = await this.authService.getClassroomsFromAccount(email);
  }
}
