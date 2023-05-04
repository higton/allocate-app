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
  newCourse: Course = null;
  selectedCourse: Course = null;
  editedCourse: Course | null = null;
  showTable: boolean = false;
  showClassrooms: boolean = false;
  timeTableSlots: String[];
  classrooms: Classroom[];

  constructor(
    public userService: UserService,
    public authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.newCourse = {
      name: '',
      professor: '',
      groupPeriod: '',
      department: '',
      localthreshold: 0,
      timeSlots: [],
      classrooms: []
    };

    if (this.userService.coursesList && this.userService.coursesList.length === 0) {
      this.getCourses();
    }
  }

  async getCourses() {
    let email:String = await this.authService.getEmail();

    await this.userService.getCoursesFromAccount(email);
  }

  async addCourseToAccount() {
    let account_email = await this.authService.getEmail();

    if (this.newCourse.name && this.newCourse.professor && this.newCourse.groupPeriod && this.newCourse.department) {
      await this.userService.addCourseToAccount(this.newCourse, account_email);

      this.newCourse = {
        name: '',
        professor: '',
        groupPeriod: '',
        department: '',
        localthreshold: 0,
        timeSlots: [],
        classrooms: []
      };
    }
  }

  async removeItem(course: Course) {
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

    this.userService.editCourseFromAccount(this.editedCourse, account_email, course.name);
  }

  openTimetable(timeSlots: string[]) {
    this.timeTableSlots = timeSlots;

    this.toggleTimetable();
  }

  toggleTimetable() {
    this.showTable = !this.showTable;
  }

  updateTimeSlots(timeSlots: string[]) {
    if (this.selectedCourse !== null) {
      this.editedCourse.timeSlots = timeSlots;
    } else {
      this.newCourse.timeSlots = timeSlots;
    }
    
    this.toggleTimetable();
  }

  updateClassrooms(classrooms: Classroom[]) {
    if (this.selectedCourse !== null) {
      this.editedCourse.classrooms = classrooms;
    } else {
      this.newCourse.classrooms = classrooms;
    }
    
    this.toggleEditClassrooms();
  }

  navigateToClassrooms() {
    this.router.navigateByUrl('/home/classrooms');
  }

  openEditClassrooms(classrooms: Classroom[]) {
    this.classrooms = classrooms;

    this.toggleEditClassrooms();
  }

  toggleEditClassrooms() {
    this.showClassrooms = !this.showClassrooms;
  }
}