import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { AuthService } from 'src/app/auth/services/auth.service';
import { UserService } from '../../services/user.service';
import { Classroom } from 'src/app/models/Classroom';

@Component({
  selector: 'app-classrooms',
  templateUrl: './classrooms.component.html',
  styleUrls: ['./classrooms.component.css']
})
export class ClassroomsComponent implements OnInit {
  @Output() next = new EventEmitter();
  
  newClassroom: Classroom;
  selectedClassroom: Classroom;
  editedClassroom: Classroom | null = null;

  constructor(
    public userService: UserService,
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
      console.log("Adding classroom to account: " + account_email.toString());
      await this.userService.addClassroomToAccount(this.newClassroom, account_email.toString());

      this.newClassroom = {
        name: '',
        number_of_seats: 0,
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

  goNext() {
    this.next.emit();
  }
}
