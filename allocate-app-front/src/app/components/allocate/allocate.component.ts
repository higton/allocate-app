import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { UserService } from 'src/app/services/user.service';
import { AuthService } from '../../auth/services/auth.service';
import { TimeslotHelper } from 'src/util/timeslot-helper';
import { SigaaHelper } from 'src/util/sigaa-helper';
import { Classroom } from 'src/app/models/Classroom';
import { Course } from 'src/app/models/Course';

@Component({
  selector: 'app-allocate',
  templateUrl: './allocate.component.html',
  styleUrls: ['./allocate.component.css']
})
export class AllocateComponent implements OnInit {
  htmlResponse: SafeHtml = '';

  constructor(
    public userService: UserService,
    public authService: AuthService,
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {}

  openEnsaleitor() {
    let classrooms:Classroom[] = [];
    let courses:any[] = [];

    const standardTimeslots = TimeslotHelper.getStandardTimeSlots();
    const standardClassrooms = this.userService.classroomsList;

    for (let classroom of this.userService.classroomsList) {
      classrooms.push({
        id: classroom.id,
        name: classroom.name,
        numberOfSeats: classroom.numberOfSeats,
        timeSlots: TimeslotHelper.invertTimeSlots(classroom.timeSlots, standardTimeslots),
      });
    }

    for (let course of this.userService.coursesList) {
      let {total_aulas, agrupamento} = SigaaHelper.parseGroupPeriod(course.groupPeriod);

      courses.push({
        id: course.id,
        name: course.name,
        professor: course.professor,
        groupPeriod: course.groupPeriod,
        department: course.department,
        localthreshold: 10,
        timeSlots: course.timeSlots,
        grouping: agrupamento,
        totalClasses: total_aulas,
        classrooms: course.classrooms,
        semesterPeriod: course.semesterPeriod,
      });
    }
    
    const url = `http://localhost:3000`;

    const body = { classrooms: classrooms, courses: courses, output: "output" };

    this.http.post(url, body, {
      headers: {
        'Content-Type': 'text/html'
      },
      responseType: 'text' // set the responseType to 'text'
    }).subscribe(
      (response) => {
        console.log("POST request successful", response);
        // process the HTML response
        const parser = new DOMParser();
        const doc = parser.parseFromString(response, 'text/html');
        console.log("Parsed HTML document:", doc);
        this.htmlResponse = this.sanitizer.bypassSecurityTrustHtml(response);
      },
      (error) => {
        console.log("Error during POST request", error);
      }
    );
  }
}

function objectNameExists(name: string, list: Course[] | Classroom[]) {
  return list.some(obj => obj.name === name);
}