import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

import { ServerService } from '../auth/services/server.service';
import { Course } from 'src/app/models/Course';
import { Classroom } from 'src/app/models/Classroom';
import TimeSlotHelper from 'src/util/timeslot-helper';
import SigaaHelper from 'src/util/sigaa';

@Injectable({
  providedIn: 'root'
})
export class UserService {
	private subjectProfilePicture = new Subject<any>();
  public classroomsList = new Array<Classroom>();
  public coursesList = new Array<Course>();

  constructor(private server: ServerService) { }

  addCourseToAccount(new_course: Course, account_email: String){
    const query = `
      mutation addCourseToAccount($name: String!, $professor: String!, $group_period: String!, $department: String!, $localthreshold: Int!, $time_slot: String!, $classrooms: String!, $account_email: String!) {
        addCourseToAccount(
          name: $name, 
          professor: $professor, 
          group_period: $group_period, 
          department: $department, 
          localthreshold: $localthreshold, 
          time_slot: $time_slot, 
          classrooms: $classrooms, 
          account_email: $account_email
        )}`;
    
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
            time_slot: new_course.timeSlots.join(','),
            classrooms: new_course.classrooms.join(','),
            account_email,
          },
        })
      ).subscribe((response: any) => {
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
          classrooms
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
          this.coursesList = [];
          
          response.data.getCoursesFromAccount.forEach((course) => {
            const timeSlots = course.time_slot.split(',');
            const classrooms = course.classrooms.split(',');
            const newCourse = {
              name: course.name,
              professor: course.professor,
              groupPeriod: course.group_period,
              department: course.department,
              localthreshold: course.localthreshold,
              timeSlots,
              classrooms,
            };
            this.coursesList.push(newCourse);
          });
          
          resolve(this.coursesList);
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

  editCourseFromAccount(newCourse: Course, account_email: String, oldCourseName: String) {
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
    // if a classroom with the same name already exists, do not add it again
    if (this.classroomsList.find((classroom) => classroom.name === newClassroom.name)) {
      return;
    }

    const query = `
      mutation addClassroomToAccount($classroom_name: String!, $classroom_number_of_seats: Int!, $time_slot: String!, $account_email: String!) {
        addClassroomToAccount(classroom_name: $classroom_name, classroom_number_of_seats: $classroom_number_of_seats, time_slot: $time_slot, account_email: $account_email)
      }
    `;

    return new Promise<void>((resolve, reject) => {
      this.server.request('POST', '/graphql',
        JSON.stringify({
          query,
          variables: { 
            classroom_name: newClassroom.name, 
            classroom_number_of_seats: newClassroom.numberOfSeats, 
            time_slot: newClassroom.timeSlots.join(','), 
            account_email 
          },
        })
      ).subscribe((response: any) => {
        this.classroomsList.push({
          name: newClassroom.name,
          numberOfSeats: newClassroom.numberOfSeats,
          timeSlots: newClassroom.timeSlots,
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
      mutation editClassroomFromAccount($classroom_name: String!, $classroom_number_of_seats: Int!, $classroom_time_slot: String!, $account_email: String!) {
        editClassroomFromAccount(classroom_name: $classroom_name, classroom_number_of_seats: $classroom_number_of_seats, classroom_time_slot: $classroom_time_slot, account_email: $account_email)
      }
    `;

    return new Promise<void>((resolve, reject) => {
      this.server.request('POST', '/graphql',
        JSON.stringify({
          query,
          variables: { 
            classroom_name: classroom.name, 
            classroom_number_of_seats: editedClassroom.numberOfSeats, 
            classroom_time_slot: editedClassroom.timeSlots.join(','),
            account_email 
          },
        })
      ).subscribe((response: any) => {
        let oldClassroomName = classroom.name;

        for (let i = 0; i < this.classroomsList.length; i++) {
          if (this.classroomsList[i].name === oldClassroomName) {
            this.classroomsList[i] = editedClassroom;
            break;
          }
        }
        
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
          time_slot
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
        let classrooms = response.data.getClassroomsFromAccount;
        
        this.classroomsList = classrooms.map((classroom) => {
          return {
            name: classroom.name,
            numberOfSeats: classroom.number_of_seats,
            timeSlots: classroom.time_slot.split(','),
          }
        });

        resolve(response.data.getClassroomsFromAccount);
      },
      (err) => {
        console.log('error', err);
        reject(err);
      })
    });
  }
}
