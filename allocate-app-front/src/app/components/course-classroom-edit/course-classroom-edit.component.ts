import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Classroom } from 'src/app/models/Classroom';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-course-classroom-edit',
  templateUrl: './course-classroom-edit.component.html',
  styleUrls: ['./course-classroom-edit.component.css']
})
export class CourseClassroomEditComponent implements OnInit {
  @Input() classroomsAdded: Classroom[] = [];
  @Input() seatCount: number = 0;
  @Output() changeClassroomsEvent = new EventEmitter<Classroom[]>();

  classroomsAvailable: Classroom[] = [];
  selectedClassroom: Classroom | null = null;
  copyClassroomsAdded: Classroom[] = [];

  constructor(public userService: UserService) { }

  ngOnInit(): void {
    this.copyClassroomsAdded = JSON.parse(JSON.stringify(this.classroomsAdded));

    this.classroomsAvailable = this.filterClassrooms(this.userService.classroomsList);
  }

  addClassroom() {
    if (!this.selectedClassroom) {
      return;
    }

    this.classroomsAdded.push(this.selectedClassroom);
    this.classroomsAvailable = this.filterClassrooms(this.userService.classroomsList);
    
    this.selectedClassroom = null;
  }

  removeClassroom(classroom: Classroom) {
    this.classroomsAdded = this.classroomsAdded.filter(classroomAdded => classroomAdded.name !== classroom.name);
    this.classroomsAvailable.push(classroom);
  }

  sendSelection() {
    this.changeClassroomsEvent.emit(this.classroomsAdded);
  }

  goBack() {
    this.changeClassroomsEvent.emit(this.copyClassroomsAdded);
  }

  filterClassrooms(classroomsList: Classroom[]) {
    let classroomsAvailable;

    classroomsAvailable = classroomsList.filter(classroom => {
      return !this.classroomsAdded.some(classroomAdded => classroomAdded.name === classroom.name);
    })

    // remove classrooms that don't have enough seats
    classroomsAvailable = classroomsAvailable.filter(classroom => {
      return classroom.numberOfSeats >= this.seatCount;
    });

    return classroomsAvailable;
  }
}
