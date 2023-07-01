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
  newClassroom: Classroom = {
    id: 0,
    name: '',
    numberOfSeats: 0,
    timeSlots: [],
  };
  selectedClassroom: Classroom | null = null;
  editedClassroom: Classroom = { ...this.newClassroom }
  showTable: boolean = false;
  timeTableSlots: String[] = [];

  constructor(
    public userService: UserService,
    public authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  async addClassroom() {
    if (this.newClassroom.name && this.newClassroom.numberOfSeats) {
      await this.userService.addClassroom(this.newClassroom);

      this.newClassroom = {
        id: 0,
        name: '',
        numberOfSeats: 0,
        timeSlots: [],
      };
    }
  }

  async removeItem(classroom: Classroom) {
    await this.userService.removeClassroom(classroom.name);
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

    this.userService.editClassroom(classroom, this.editedClassroom);
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
    if (this.selectedClassroom !== null && this.editedClassroom) {
      this.editedClassroom.timeSlots = timeSlots;
    } else {
      this.newClassroom.timeSlots = timeSlots;
    }
    
    this.toggleTimetable();
  }

  updateClassrooms(classrooms: Classroom[]) {
    if (this.selectedClassroom !== null && this.editedClassroom) {
      this.editedClassroom.timeSlots = classrooms[0].timeSlots;
    } else {
      this.newClassroom.timeSlots = classrooms[0].timeSlots;
    }

    this.toggleTimetable();
  }
}
