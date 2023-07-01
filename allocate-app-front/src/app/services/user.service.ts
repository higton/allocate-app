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

  addCourse(newCourse: Course) {
    // if a course with the same name already exists, do nothing
    if (this.coursesList.find((course) => course.name === newCourse.name)) {
      return;
    }

    let classrooms = newCourse.classrooms.map((classroom) => classroom.name).join(',');

    const query = `
      mutation addCourse(
        $name: String!, 
        $professor: String!, 
        $group_period: String!, 
        $department: String!, 
        $localthreshold: Int!, 
        $time_slot: String!, 
        $classrooms: String!, 
        $semester_period: String!
        ) {
          addCourse(
            name: $name, 
            professor: $professor, 
            group_period: $group_period, 
            department: $department, 
            localthreshold: $localthreshold, 
            time_slot: $time_slot, 
            classrooms: $classrooms,
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

  getCourses(): Promise<Course[]> {
    const query = `
      query getCourses {
        getCourses {
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
        })
      ).subscribe(
        (response: any) => {
          this.coursesList = [];

          response.data.getCourses.forEach((course: any) => {
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

  removeCourse(course_name: String) {
    const query = `
      mutation removeCourse($course_name: String!) {
        removeCourse(course_name: $course_name)
      }
    `;

    return new Promise<void>((resolve, reject) => {
      this.server.request('POST', '/graphql',
        JSON.stringify({
          query,
          variables: { course_name },
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

  editCourse(newCourse: Course) {
    let classrooms = newCourse.classrooms.map((classroom) => classroom.name).join(',');

    const query = `
      mutation editCourse(
        $course_name: String!, 
        $new_course_name: String!, 
        $new_professor: String!, 
        $new_group_period: String!, 
        $new_department: String!, 
        $new_localthreshold: Int!, 
        $new_time_slot: String!, 
        $new_classrooms: String!,
        $new_semester_period: String!
        ) {
          editCourse(
            course_name: $course_name, 
            new_course_name: $new_course_name, 
            new_professor: $new_professor, 
            new_group_period: $new_group_period, 
            new_department: $new_department, 
            new_localthreshold: $new_localthreshold, 
            new_time_slot: $new_time_slot,
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

  addClassroom(newClassroom: Classroom) {
    // if a classroom with the same name already exists, do not add it again
    if (this.classroomsList.find((classroom) => classroom.name === newClassroom.name)) {
      return;
    }

    const query = `
      mutation addClassroom($classroom_name: String!, $classroom_number_of_seats: Int!, $time_slot: String!) {
        addClassroom(classroom_name: $classroom_name, classroom_number_of_seats: $classroom_number_of_seats, time_slot: $time_slot)
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

  removeClassroom(classroom_name: String) {
    const query = `
      mutation removeClassroom($classroom_name: String!) {
        removeClassroom(classroom_name: $classroom_name)
      }
    `;

    return new Promise<void>((resolve, reject) => {
      this.server.request('POST', '/graphql',
        JSON.stringify({
          query,
          variables: { classroom_name },
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

  editClassroom(classroom: Classroom, editedClassroom: Classroom) {
    const query = `
      mutation editClassroom(
        $classroom_name: String!, 
        $classroom_number_of_seats: Int!, 
        $classroom_time_slot: String!
      ) {
        editClassroom(
          classroom_name: $classroom_name, 
          classroom_number_of_seats: $classroom_number_of_seats, 
          classroom_time_slot: $classroom_time_slot
          )
      }
    `;

    return new Promise<void>((resolve, reject) => {
      this.server.request('POST', '/graphql',
        JSON.stringify({
          query,
          variables: {
            classroom_name: classroom.name,
            classroom_number_of_seats: editedClassroom.numberOfSeats,
            classroom_time_slot: editedClassroom.timeSlots.join(',')
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

  getClassrooms(): Promise<Classroom[]> {
    const query = `
      query getClassrooms {
        getClassrooms {
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
        })
      ).subscribe((response: any) => {
        let classrooms = response.data.getClassrooms;

        this.classroomsList = classrooms.map((classroom: any) => {
          return {
            id: classroom.id,
            name: classroom.name,
            numberOfSeats: classroom.number_of_seats,
            timeSlots: classroom.time_slot.split(','),
          }
        });

        resolve(response.data.getClassrooms);
      },
        (err) => {
          reject(err);
        })
    });
  }

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
