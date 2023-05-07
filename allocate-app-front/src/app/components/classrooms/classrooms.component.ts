import { Component, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/auth/services/auth.service';
import { UserService } from '../../services/user.service';
import { Classroom } from 'src/app/models/Classroom';

@Component({
  selector: 'app-classrooms',
  templateUrl: './classrooms.component.html',
  styleUrls: ['./classrooms.component.css']
})
export class ClassroomsComponent implements OnInit {
  newClassroom: Classroom;
  selectedClassroom: Classroom = null;
  editedClassroom: Classroom | null = null;
  showTable: boolean = false;
  timeTableSlots: String[];

  constructor(
    public userService: UserService,
    public authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.newClassroom = {
      name: '',
      numberOfSeats: 0,
      timeSlots: [],
    };
  }

  async addClassroomToAccount() {
    let account_email:String = await this.authService.getEmail();

    if (this.newClassroom.name && this.newClassroom.numberOfSeats) {
      await this.userService.addClassroomToAccount(this.newClassroom, account_email.toString());

      this.newClassroom = {
        name: '',
        numberOfSeats: 0,
        timeSlots: [],
      };
    }
  }

  async removeItem(classroom: Classroom) {
    let account_email:String = await this.authService.getEmail();

    await this.userService.removeClassroomFromAccount(classroom.name, account_email);
  }

  startEditing(classroom: Classroom) {
    if (this.selectedClassroom !== null) {
      this.selectedClassroom = null
    } else {
      this.selectedClassroom = classroom;
    }

    this.editedClassroom = { ...classroom };
  }
  
  cancelEditing() {
    this.selectedClassroom = null;
  }

  async editClassroom(classroom: Classroom) {
    this.selectedClassroom = null;
    
    let account_email:String = await this.authService.getEmail();

    this.userService.editClassroomFromAccount(classroom, this.editedClassroom, account_email);
  }

  navigateToCourses() {
    this.router.navigateByUrl('/home/courses');
  }

  openTimetable(timeSlots: string[]) {
    this.timeTableSlots = timeSlots;

    this.toggleTimetable();
  }


  toggleTimetable() {
    this.showTable = !this.showTable;
  }

  updateTimeSlots(timeSlots: string[]) {
    if (this.selectedClassroom !== null) {
      this.editedClassroom.timeSlots = timeSlots;
    } else {
      this.newClassroom.timeSlots = timeSlots;
    }
    
    this.toggleTimetable();
  }

  updateClassrooms(classrooms: Classroom[]) {
    if (this.selectedClassroom !== null) {
      this.editedClassroom.timeSlots = classrooms[0].timeSlots;
    } else {
      this.newClassroom.timeSlots = classrooms[0].timeSlots;
    }

    this.toggleTimetable();
  }
}
