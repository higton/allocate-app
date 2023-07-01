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
      id: 0,
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
    await this.userService.getCourses();
  }

  async addCourseToAccount(newCourse: Course) {
    if (newCourse.name && newCourse.professor && newCourse.groupPeriod && newCourse.department && newCourse.semesterPeriod) {
      await this.userService.addCourse(newCourse);
    }
  }

  async removeCourse(course: Course) {
    await this.userService.removeCourse(course.name);
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

    this.userService.editCourse(course);
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