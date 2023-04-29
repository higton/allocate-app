import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { AuthService } from '../auth/services/auth.service';
import { UserService } from '../services/user.service';
import { Course } from 'src/app/models/Course';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {
  @Output() next = new EventEmitter();

  newCourse: Course;
  selectedCourse: Course;
  editedCourse: Course | null = null;

  constructor(
    public userService: UserService,
    public authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.newCourse = {
      name: '',
      professor: '',
      group_period: '',
      department: '',
      localthreshold: 0,
      time_slot: '',
    };
  }

  async addCourseToAccount() {
    let account_email = await this.authService.getEmail();

    if (this.newCourse.name && this.newCourse.professor && this.newCourse.group_period && this.newCourse.department && this.newCourse.localthreshold && this.newCourse.time_slot) {
      await this.userService.addCourseToAccount(this.newCourse, account_email);

      this.newCourse = {
        name: '',
        professor: '',
        group_period: '',
        department: '',
        localthreshold: 0,
        time_slot: '',
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

  goNext() {
    this.next.emit();
  }
}