import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../auth/services/auth.service';
import { UserService } from '../services/user.service';
import { Course } from 'src/app/models/Course';
import { Classroom } from 'src/app/models/Classroom';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {
  selectedCourse: Course | null = null;
  newCourse: Course | null = null;
  showTable: boolean = false;
  showClassrooms: boolean = false;
  timeTableSlots: String[] = [];
  classrooms: Classroom[] = [];
  editedCourse: Course | null = null;
  showList: boolean = true;

  constructor(
    public userService: UserService,
    public authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (this.userService.coursesList && this.userService.coursesList.length === 0) {
      this.getCourses();
    }

    this.newCourse = {
      name: '',
      professor: '',
      groupPeriod: '',
      department: '',
      localthreshold: 0,
      timeSlots: [],
      classrooms: [],
      semesterPeriod: 1,
    };
    
  }

  async getCourses() {
    let email:String = await this.authService.getEmail();

    await this.userService.getCoursesFromAccount(email);
  }

  async addCourseToAccount(newCourse: Course) {
    let account_email = await this.authService.getEmail();

    if (newCourse.name && newCourse.professor && newCourse.groupPeriod && newCourse.department && newCourse.semesterPeriod) {
      await this.userService.addCourseToAccount(newCourse, account_email);
    }
  }

  async removeCourse(course: Course) {
    let account_email:String = await this.authService.getEmail();

    await this.userService.removeCourseFromAccount(course.name, account_email);
  }

  startEditing(course: Course) {
    if (this.selectedCourse !== null) {
      this.selectedCourse = null
    } else {
      this.selectedCourse = course;
    }

    this.editedCourse = { ...course };
  }
  
  cancelEditing() {
    this.selectedCourse = null;
  }

  async editCourse(course: Course) {
    this.selectedCourse = null;

    let account_email:String = await this.authService.getEmail();

    this.userService.editCourseFromAccount(course, account_email);
  }

  navigateToClassrooms() {
    this.router.navigateByUrl('/home/classrooms');
  }

  updateNewCourse(course: Course) {
    this.addCourseToAccount(course);

    this.toggleShowList();
  }

  toggleShowList() {
    this.showList = !this.showList;
  }

  navigateToAllocate() {
    this.router.navigateByUrl('/home/allocate');
  }
}