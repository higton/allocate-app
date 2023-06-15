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

  addCourseToAccount(newCourse: Course, account_email: String) {
    // if a course with the same name already exists, do nothing
    if (this.coursesList.find((course) => course.name === newCourse.name)) {
      return;
    }

    let classrooms = newCourse.classrooms.map((classroom) => classroom.name).join(',');

    const query = `
      mutation addCourseToAccount(
        $name: String!, 
        $professor: String!, 
        $group_period: String!, 
        $department: String!, 
        $localthreshold: Int!, 
        $time_slot: String!, 
        $classrooms: String!, 
        $account_email: String!,
        $semester_period: String!
        ) {
          addCourseToAccount(
            name: $name, 
            professor: $professor, 
            group_period: $group_period, 
            department: $department, 
            localthreshold: $localthreshold, 
            time_slot: $time_slot, 
            classrooms: $classrooms, 
            account_email: $account_email,
            semester_period: $semester_period
          )
        }`;

    return new Promise<void>((resolve, reject) => {
      this.server.request('POST', '/graphql',
        JSON.stringify({
          query,
          variables: {
            name: newCourse.name,
            professor: newCourse.professor,
            group_period: newCourse.groupPeriod,
            department: newCourse.department,
            localthreshold: newCourse.localthreshold,
            time_slot: newCourse.timeSlots.join(','),
            classrooms: classrooms,
            account_email,
            semester_period: newCourse.semesterPeriod.toString(),
          },
        })
      ).subscribe((response: any) => {
        this.coursesList.push(newCourse);

        resolve();
      }, (err) => {
        reject(err);
      });
    });
  }

  getCoursesFromAccount(email: String): Promise<Course[]> {
    const query = `
      query getCoursesFromAccount($email: String!){
        getCoursesFromAccount(email: $email) {
          id,
          name,
          professor,
          group_period,
          department,
          localthreshold,
          time_slot,
          classrooms,
          semester_period
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

          response.data.getCoursesFromAccount.forEach((course: any) => {
            const timeSlots = course.time_slot.split(',');
            let classrooms = [];

            if (course.classrooms !== '') {
              classrooms = course.classrooms.split(',');
            }

            const newClassrooms: Classroom[] = classrooms.map((classroomName: any) => {
              const classroomObj = this.classroomsList.find((classroomObj) => classroomObj.name === classroomName);

              return {
                id: classroomObj ? classroomObj.id : 0,
                name: classroomName,
                numberOfSeats: classroomObj ? classroomObj.numberOfSeats : 0,
                timeSlots: classroomObj ? classroomObj.timeSlots : [],
              };
            });

            const newCourse: Course = {
              id: course.id,
              name: course.name,
              professor: course.professor,
              groupPeriod: course.group_period,
              department: course.department,
              localthreshold: course.localthreshold,
              timeSlots,
              classrooms: newClassrooms,
              semesterPeriod: course.semester_period,
            };
            console.log("newCourse: ", newCourse);
            this.coursesList.push(newCourse);
          });

          resolve(this.coursesList);
        },
        (err) => {
          reject(err);
        })
    });
  }

  removeCourseFromAccount(course_name: String, account_email: String) {
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
        this.coursesList = this.coursesList.filter((course) => course.name !== course_name);
        resolve();
      },
        (err) => {
          reject(err);
        })
    });
  }

  editCourseFromAccount(newCourse: Course, account_email: String) {
    let classrooms = newCourse.classrooms.map((classroom) => classroom.name).join(',');

    const query = `
      mutation editCourseFromAccount(
        $course_name: String!, 
        $new_course_name: String!, 
        $new_professor: String!, 
        $new_group_period: String!, 
        $new_department: String!, 
        $new_localthreshold: Int!, 
        $new_time_slot: String!, 
        $account_email: String!,
        $new_classrooms: String!,
        $new_semester_period: String!
        ) {
          editCourseFromAccount(
            course_name: $course_name, 
            new_course_name: $new_course_name, 
            new_professor: $new_professor, 
            new_group_period: $new_group_period, 
            new_department: $new_department, 
            new_localthreshold: $new_localthreshold, 
            new_time_slot: $new_time_slot, 
            account_email: $account_email,
            new_classrooms: $new_classrooms,
            new_semester_period: $new_semester_period
          )
        }
    `;

    return new Promise<void>((resolve, reject) => {
      this.server.request('POST', '/graphql',
        JSON.stringify({
          query,
          variables: {
            course_name: newCourse.name,
            new_course_name: newCourse.name,
            new_professor: newCourse.professor,
            new_group_period: newCourse.groupPeriod,
            new_department: newCourse.department,
            new_localthreshold: newCourse.localthreshold,
            new_time_slot: newCourse.timeSlots.join(','),
            new_classrooms: classrooms,
            account_email,
            new_semester_period: newCourse.semesterPeriod.toString(),
          },
        })
      ).subscribe((response: any) => {
        // update course in coursesList
        const courseIndex = this.coursesList.findIndex((course) => course.name === newCourse.name);

        this.coursesList[courseIndex] = newCourse;

        resolve();
      },
        (err) => {
          reject(err);
        })
    });
  }

  addClassroomToAccount(newClassroom: Classroom, account_email: String) {
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
          id: newClassroom.id,
          name: newClassroom.name,
          numberOfSeats: newClassroom.numberOfSeats,
          timeSlots: newClassroom.timeSlots,
        });

        resolve();
      },
        (err) => {
          reject(err);
        })
    });
  }

  removeClassroomFromAccount(classroom_name: String, account_email: String) {
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
          reject(err);
        })
    });
  }

  editClassroomFromAccount(classroom: Classroom, editedClassroom: Classroom, account_email: String) {
    const query = `
      mutation editClassroomFromAccount(
        $classroom_name: String!, 
        $classroom_number_of_seats: Int!, 
        $classroom_time_slot: String!, 
        $account_email: String!
      ) {
        editClassroomFromAccount(
          classroom_name: $classroom_name, 
          classroom_number_of_seats: $classroom_number_of_seats, 
          classroom_time_slot: $classroom_time_slot, 
          account_email: $account_email)
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
          reject(err);
        })
    });
  }

  getClassroomsFromAccount(email: String): Promise<Classroom[]> {
    const query = `
      query getClassroomsFromAccount($email: String!) {
        getClassroomsFromAccount(email: $email) {
          id
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

        this.classroomsList = classrooms.map((classroom: any) => {
          return {
            id: classroom.id,
            name: classroom.name,
            numberOfSeats: classroom.number_of_seats,
            timeSlots: classroom.time_slot.split(','),
          }
        });

        resolve(response.data.getClassroomsFromAccount);
      },
        (err) => {
          reject(err);
        })
    });
  }

  // create function to get all existent solutions
  // the endpoint is "/exchanges" and the method is GET
  // the response example:
  //   {
  //     "solvers": [
  //         "solver1",
  //         "solver2"
  //     ]
  // }
  // the function should return an array of strings with the solvers names
  getSolutions(): Promise<string[]> {
    return new Promise((resolve, reject) => {
      this.server.request('GET', '/exchanges').subscribe({
        next: (response: undefined | any) => {
          if (response) {
            resolve(response.solvers);
          } else {
            resolve([]);
          }
        },
        error: (err) => {
          reject(err);
        }
      });
    });
  }

  // create function to calculate the solution using a specific solver
  // the endpoint is "/calculate/{solver}" and the method is POST
  // the body is a xml
  // the response example:
  // {
  //   "message": "Calculating"
  // }
  // 
  // another example:
  // {
  //   "message": "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n\n<solution name=\"instance-name3\" runtime=\"0\" cores=\"1\" technique=\"UniTime/Local Search\" author=\"UniTime Solver\" institution=\"UniTime\" country=\"Czechia\">\n  <class id=\"1\" days=\"0010000\" start=\"192\" weeks=\"1111111111111\" room=\"3\">\n    <!--W 16:00 - 18:00 1111111111111 R3 -->\n  </class>\n  <class id=\"10001\" days=\"0000100\" start=\"168\" weeks=\"1111111111111\" room=\"2\">\n    <!--F 14:00 - 18:00 1111111111111 R2 -->\n  </class>\n</solution>\n"
  // }

  // the function should return the solution as a string
  calculateSolution(solver: string, xml: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.server.xmlRequest('POST', `/calculate/${solver}`, xml).subscribe({
        next: (response: undefined | any) => {
          if (response) {
            resolve(response.message);
          } else {
            resolve('');
          }
        },
        error: (err) => {
          reject(err);
        }
      });
    });
  }
}
