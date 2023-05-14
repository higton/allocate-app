import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { UserService } from 'src/app/services/user.service';
import { AuthService } from '../../auth/services/auth.service';
import { TimeSlotHelper } from 'src/util/timeslot-helper';
import { Classroom } from 'src/app/models/Classroom';

@Component({
  selector: 'app-allocate',
  templateUrl: './allocate.component.html',
  styleUrls: ['./allocate.component.css']
})
export class AllocateComponent implements OnInit {
  htmlContent: SafeHtml;

  constructor(
    public userService: UserService,
    public authService: AuthService,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {}

  openEnsaleitor() {
    let classrooms:Classroom[] = [];

    for (let classroom of this.userService.classroomsList) {
      let standardTimeslots = TimeSlotHelper.getStandardTimeSlots();
      classrooms.push({
        name: classroom.name,
        numberOfSeats: classroom.numberOfSeats,
        timeSlots: TimeSlotHelper.invertTimeSlots(classroom.timeSlots, standardTimeslots),
      });
    }

    console.log(classrooms);
    
    const url = `http://localhost:3000`;

    const body = { classrooms: classrooms, output: "output" };

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
      },
      (error) => {
        console.log("Error during POST request", error);
      }
    );
  }
}
