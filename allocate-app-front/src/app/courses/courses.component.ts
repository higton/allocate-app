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
      number_of_students: 0,
    };
  }

  async addCourseToAccount() {
    let account_email = await this.authService.getEmail();

    if (this.newCourse.name && this.newCourse.number_of_students) {
      await this.userService.addCourseToAccount(this.newCourse.name, this.newCourse.number_of_students, account_email.toString());

      this.newCourse = {
        name: '',
        number_of_students: 0,
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

    this.userService.editCourseFromAccount(account_email, course, this.editedCourse);
  }

  goNext() {
    this.next.emit();
  }
}