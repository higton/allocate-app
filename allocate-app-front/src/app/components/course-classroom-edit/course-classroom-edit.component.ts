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
  @Output() changeClassroomsEvent = new EventEmitter<Classroom[]>();

  classroomsAvailable: Classroom[] = [];
  selectedClassroom: Classroom | null = null;
  copyClassroomsAdded: Classroom[] = [];

  constructor(public userService: UserService) { }

  ngOnInit(): void {
    this.copyClassroomsAdded = JSON.parse(JSON.stringify(this.classroomsAdded));

    // the classrooms availables should be all the classrooms minus the classrooms added
    this.classroomsAvailable = this.userService.classroomsList.filter(classroom => {
      return !this.classroomsAdded.some(classroomAdded => classroomAdded.name === classroom.name);
    });
  }

  addClassroom() {
    if (!this.selectedClassroom) {
      return;
    }

    this.classroomsAvailable = this.classroomsAvailable.filter(classroomAvailable => {
      if (this.selectedClassroom) {
        classroomAvailable.name !== this.selectedClassroom.name
      }
    });
    this.classroomsAdded.push(this.selectedClassroom);
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
}
