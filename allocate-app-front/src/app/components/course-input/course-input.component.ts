import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Course } from 'src/app/models/Course';
import { Classroom } from 'src/app/models/Classroom';

@Component({
  selector: 'app-course-input',
  templateUrl: './course-input.component.html',
  styleUrls: ['./course-input.component.css']
})
export class CourseInputComponent implements OnInit {
  @Input() course: Course = new Course();
  @Input() type: string = "insert";
  @Output() changeCourseEvent = new EventEmitter<Course>();
  @Output() cancelEvent = new EventEmitter<void>();

  showTable: boolean = false;
  showClassrooms: boolean = false;
  timeTableSlots: String[] = [];
  classrooms: Classroom[] = [];
  copyCourse: Course = JSON.parse(JSON.stringify(this.course));

  constructor() { }

  ngOnInit(): void {
  }

  openTimetable(timeSlots: string[]) {
    this.timeTableSlots = timeSlots;

    this.toggleTimetable();
  }

  toggleTimetable() {
    this.showTable = !this.showTable;
  }

  updateTimeSlots(timeSlots: string[]) {
    const sortedTimeSlots = this.sortTimeSlots(timeSlots);

    this.course.timeSlots = sortedTimeSlots;
    
    this.toggleTimetable();
  }

  updateClassrooms(classrooms: Classroom[]) {
    this.course.classrooms = classrooms;
    
    this.toggleEditClassrooms();
  }

  openEditClassrooms(classrooms: Classroom[]) {
    this.classrooms = classrooms;

    this.toggleEditClassrooms();
  }

  toggleEditClassrooms() {
    this.showClassrooms = !this.showClassrooms;
  }

  sendSelection() {
    // if all obligatory fields are filled
    if (
      this.course.name && 
      this.course.classrooms.length > 0 && 
      this.course.department && 
      this.course.groupPeriod &&
      this.course.professor &&
      this.course.semesterPeriod &&
      this.course.timeSlots.length > 0 &&
      this.course.seatCount > 0
    )
    {
      this.changeCourseEvent.emit(this.course);
    } else {
      alert("Por favor, preencha todos os campos obrigatórios.");
    }
  }

  goBack() {
    this.cancelEvent.emit();
  }

  sortTimeSlots(timeSlots: string[]): string[] {
    timeSlots.sort((a, b) => {
      const aTime = parseInt(a.slice(0, -2));
      const bTime = parseInt(b.slice(0, -2));

      if (aTime === bTime) {
        const aSlot = parseInt(a.slice(-1));
        const bSlot = parseInt(b.slice(-1));
        return aSlot - bSlot;
      }
    
      return aTime - bTime;
    });

    return timeSlots;
  }
}
