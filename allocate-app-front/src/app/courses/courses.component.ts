import { Component, Input, OnInit } from '@angular/core';

import { AuthService } from '../auth/services/auth.service';
import { Course } from 'src/app/models/Course';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {
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
      class_number: 0,
      number_of_students: 0,
    };
  }

  async addCourseToAccount() {
    let account_email:String = await this.authService.getEmail();

    if (this.newCourse.name && this.newCourse.class_number && this.newCourse.number_of_students) {
      await this.authService.addCourseToAccount(this.newCourse.name, this.newCourse.class_number, this.newCourse.number_of_students, account_email)
        .then((result) => {
          // Append the new course to the list of courses
          this.coursesList.push(this.newCourse);
        });

      this.newCourse = {
        name: '',
        class_number: 0,
        number_of_students: 0,
      };
    }
  }

  async removeItem(course: Course) {
    let account_email:String = await this.authService.getEmail();

    await this.authService.removeCourseFromAccount(course.name, course.class_number, account_email)
      .then((result) => {
        // Remove the course from the list of courses
        this.coursesList = this.coursesList.filter((item) => {
          return item.name !== course.name && item.class_number !== course.class_number;
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

    this.authService.editCourseFromAccount(account_email, this.editedCourse.name, this.editedCourse.class_number, this.editedCourse.number_of_students)
      .then((result) => {
        // Update the course in the list of courses
        this.coursesList = this.coursesList.map((course) => {
          if (course.name === this.editedCourse.name && course.class_number === this.editedCourse.class_number) {
            return this.editedCourse;
          } else {
            return course;
          }
        });
      });
  }
}