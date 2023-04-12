import { Component, Input, OnInit } from '@angular/core';

import { AuthService } from 'src/app/auth/services/auth.service';
import { Classroom } from 'src/app/models/Classroom';

@Component({
  selector: 'app-classrooms',
  templateUrl: './classrooms.component.html',
  styleUrls: ['./classrooms.component.css']
})
export class ClassroomsComponent implements OnInit {
  @Input() classroomsList:Classroom[];

  newClassroom: Classroom;
  selectedClassroom: Classroom;
  editedClassroom: Classroom | null = null;

  constructor(
    public authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.newClassroom = {
      name: '',
      number_of_seats: 0,
    };
  }

  async addClassroomToAccount() {
    let account_email:String = await this.authService.getEmail();

    if (this.newClassroom.name && this.newClassroom.number_of_seats) {
      await this.authService.addClassroomToAccount(this.newClassroom.name, this.newClassroom.number_of_seats, account_email)
        .then((result) => {
          this.classroomsList.push(this.newClassroom);
        });

      this.newClassroom = {
        name: '',
        number_of_seats: 0,
      };
    }
  }

  async removeItem(classroom: Classroom) {
    let account_email:String = await this.authService.getEmail();

    await this.authService.removeClassroomFromAccount(classroom.name, account_email)
      .then((result) => {
        this.classroomsList = this.classroomsList.filter((item) => {
          return item.name !== classroom.name;
        });
      });
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

  async editClassroom() {
    this.selectedClassroom = null;
    
    let account_email:String = await this.authService.getEmail();

    this.authService.editClassroomFromAccount(this.editedClassroom.name, this.editedClassroom.number_of_seats, account_email)
      .then((result) => {
        // update classroom in classroomsList array
        this.classroomsList = this.classroomsList.map((item) => {
          if (item.name === this.editedClassroom.name) {
            return this.editedClassroom;
          }
          return item;
        });
      });
  }
}
