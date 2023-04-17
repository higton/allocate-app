import { Component, Input, OnInit } from '@angular/core';

import { AuthService } from '../../auth/services/auth.service';
import { Course } from '../../models/Course';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {
  @Input() coursesList:Course[];

  newCourse: Course;
  selectedCourse: Course;
  editedCourse: Course | null = null;

  constructor(
    public authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.newCourse = {
      name: '',
      number_of_students: 0,
    };
  }

  async addCourseToAccount() {
    let account_email:String = await this.authService.getEmail();

    if (this.newCourse.name && this.newCourse.number_of_students) {
      await this.authService.addCourseToAccount(this.newCourse.name, this.newCourse.number_of_students, account_email)
        .then((result) => {
          this.coursesList.push(this.newCourse);
        });

      this.newCourse = {
        name: '',
        number_of_students: 0,
      };
    }
  }

  async removeItem(course: Course) {
    let account_email:String = await this.authService.getEmail();

    await this.authService.removeCourseFromAccount(course.name, account_email)
      .then((result) => {
        this.coursesList = this.coursesList.filter((item) => {
          return item.name !== course.name;
        });
      });
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

  async editCourse() {
    this.selectedCourse = null;
    
    let account_email:String = await this.authService.getEmail();

    this.authService.editCourseFromAccount(account_email, this.editedCourse.name, this.editedCourse.number_of_students)
      .then((result) => {
        // update course in coursesList array
        this.coursesList = this.coursesList.map((item) => {
          if (item.name === this.editedCourse.name) {
            return this.editedCourse;
          }
          return item;
        });
      });
  }
}
