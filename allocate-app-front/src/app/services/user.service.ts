import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

import { ServerService } from '../auth/services/server.service';
import { Course } from 'src/app/models/Course';
import { Classroom } from 'src/app/models/Classroom';

@Injectable({
  providedIn: 'root'
})
export class UserService {
	private subjectProfilePicture = new Subject<any>();
  public classroomsList = new Array<Classroom>();
  public coursesList = new Array<Course>();

  constructor(private server: ServerService) { }

  sendUpdateProfilePictureEvent() {
    this.subjectProfilePicture.next();
  }

  getUpdateProfilePictureEvent(): Observable<any>{
    return this.subjectProfilePicture.asObservable();
  }

  addCourseToAccount(new_course: Course, account_email: String){
    const query = `
      mutation addCourseToAccount($name: String!, $professor: String!, $group_period: String!, $department: String!, $localthreshold: Int!, $time_slot: String!, $account_email: String!) {
        addCourseToAccount(name: $name, professor: $professor, group_period: $group_period, department: $department, localthreshold: $localthreshold, time_slot: $time_slot, account_email: $account_email)
      }
    `;
    
    return new Promise<void>((resolve, reject) => {
      this.server.request('POST', '/graphql',
        JSON.stringify({
          query,
          variables: {
            name: new_course.name,
            professor: new_course.professor,
            group_period: new_course.groupPeriod,
            department: new_course.department,
            localthreshold: new_course.localthreshold,
            time_slot: new_course.timeSlots,
            account_email,
          },
        })
      ).subscribe((response: any) => {
        console.log('response', response);

        // add course to coursesList
        this.coursesList.push(new_course);

        resolve();
      }, (err) => {
        console.log('error', err);
        reject(err);
      });
    });
  }

  getCoursesFromAccount(email: String): Promise<Course[]>{
    const query = `
      query getCoursesFromAccount($email: String!){
        getCoursesFromAccount(email: $email) {
          name,
          professor,
          group_period,
          department,
          localthreshold,
          time_slot,
        }
      }
    `;

    return new Promise((resolve, reject) => {
      this.server.request('POST', '/graphql',
        JSON.stringify({
          query,
          variables: { email },
        })
      ).subscribe(
        (response: any) => {
          // update coursesList
          this.coursesList = response.data.getCoursesFromAccount;

          resolve(response.data.getCoursesFromAccount);
        },
        (err) => {
          console.log('error', err);
          reject(err);
        })
    });
  }

  removeCourseFromAccount(course_name: String, account_email: String){
    const query = `
      mutation removeCourseFromAccount($course_name: String!, $account_email: String!) {
        removeCourseFromAccount(course_name: $course_name, account_email: $account_email)
      }
    `;

    return new Promise<void>((resolve, reject) => {
      this.server.request('POST', '/graphql',
        JSON.stringify({
          query,
          variables: { course_name, account_email },
        })
      ).subscribe((response: any) => {
        console.log('response', response);

        // remove course from coursesList
        this.coursesList = this.coursesList.filter((course) => course.name !== course_name);
        resolve();
      },
      (err) => {
        console.log('error', err);
        reject(err);
      })
    });
  }

  //     editCourseFromAccount(account_email: String!, course_name: String!, new_course_name: String!, new_professor: String!, new_group_period: String!, new_department: String!, new_localthreshold: Int!, new_time_slot: String!): String,
  editCourseFromAccount(newCourse: Course, account_email: String, oldCourseName: String) {
    // print newCourse
    console.log('newCourse', newCourse);
    const query = `
      mutation editCourseFromAccount($course_name: String!, $new_course_name: String!, $new_professor: String!, $new_group_period: String!, $new_department: String!, $new_localthreshold: Int!, $new_time_slot: String!, $account_email: String!) {
        editCourseFromAccount(course_name: $course_name, new_course_name: $new_course_name, new_professor: $new_professor, new_group_period: $new_group_period, new_department: $new_department, new_localthreshold: $new_localthreshold, new_time_slot: $new_time_slot, account_email: $account_email)
      }
    `;

    return new Promise<void>((resolve, reject) => {
      this.server.request('POST', '/graphql',
        JSON.stringify({
          query,
          variables: {
            course_name: oldCourseName,
            new_course_name: newCourse.name,
            new_professor: newCourse.professor,
            new_group_period: newCourse.groupPeriod,
            new_department: newCourse.department,
            new_localthreshold: newCourse.localthreshold,
            new_time_slot: newCourse.timeSlots,
            account_email,
          },
        })
      ).subscribe((response: any) => {
        console.log('response', response);

        // update course in coursesList
        this.coursesList = this.coursesList.map((course) => {
          if (course.name === oldCourseName) {
            return newCourse;
          }
          return course;
        });

        resolve();
      },
      (err) => {
        console.log('error', err);
        reject(err);
      })
    });
  }

  addClassroomToAccount(newClassroom: Classroom, account_email: String){
    // if classroom already exists, do not add it again
    if (this.classroomsList.find((classroom) => classroom.name === newClassroom.name)) {
      return;
    }

    const query = `
      mutation addClassroomToAccount($classroom_name: String!, $classroom_number_of_seats: Int!, $account_email: String!) {
        addClassroomToAccount(classroom_name: $classroom_name, classroom_number_of_seats: $classroom_number_of_seats, account_email: $account_email)
      }
    `;

    return new Promise<void>((resolve, reject) => {
      this.server.request('POST', '/graphql',
        JSON.stringify({
          query,
          variables: { classroom_name: newClassroom.name, classroom_number_of_seats: newClassroom.number_of_seats, account_email },
        })
      ).subscribe((response: any) => {
        this.classroomsList.push({
          name: newClassroom.name,
          number_of_seats: newClassroom.number_of_seats,
        });

        resolve();
      },
      (err) => {
        console.log('error', err);
        reject(err);
      })
    });
  }

  removeClassroomFromAccount(classroom_name: String, account_email: String){
    const query = `
      mutation removeClassroomFromAccount($classroom_name: String!, $account_email: String!) {
        removeClassroomFromAccount(classroom_name: $classroom_name, account_email: $account_email)
      }
    `;

    return new Promise<void>((resolve, reject) => {
      this.server.request('POST', '/graphql',
        JSON.stringify({
          query,
          variables: { classroom_name, account_email },
        })
      ).subscribe((response: any) => {
        // remove classroom from classroomsList
        this.classroomsList = this.classroomsList.filter((classroom) => classroom.name !== classroom_name);

        resolve();
      },
      (err) => {
        console.log('error', err);
        reject(err);
      })
    });
  }

  editClassroomFromAccount(classroom: Classroom, editedClassroom: Classroom, account_email: String){
    const query = `
      mutation editClassroomFromAccount($classroom_name: String!, $classroom_number_of_seats: Int!, $account_email: String!) {
        editClassroomFromAccount(classroom_name: $classroom_name, classroom_number_of_seats: $classroom_number_of_seats, account_email: $account_email)
      }
    `;

    return new Promise<void>((resolve, reject) => {
      this.server.request('POST', '/graphql',
        JSON.stringify({
          query,
          variables: { classroom_name: classroom.name, classroom_number_of_seats: editedClassroom.number_of_seats, account_email },
        })
      ).subscribe((response: any) => {
        // update classroom in classroomsList
        this.classroomsList = this.classroomsList.map((classroom) => {
          if (classroom.name === classroom.name) {
            return editedClassroom;
          }
          return classroom;
        });
        
        resolve();
      },
      (err) => {
        console.log('error', err);
        reject(err);
      })
    });
  }

  getClassroomsFromAccount(email: String): Promise<Classroom[]>{
    const query = `
      query getClassroomsFromAccount($email: String!) {
        getClassroomsFromAccount(email: $email) {
          name
          number_of_seats
        }
      }
    `;

    return new Promise((resolve, reject) => {
      this.server.request('POST', '/graphql',
        JSON.stringify({
          query,
          variables: { email },
        })
      ).subscribe((response: any) => {
        this.classroomsList = response.data.getClassroomsFromAccount;
        resolve(response.data.getClassroomsFromAccount);
      },
      (err) => {
        console.log('error', err);
        reject(err);
      })
    });
  }
}
