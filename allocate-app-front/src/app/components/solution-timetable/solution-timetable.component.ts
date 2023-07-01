import { Component, Input, OnInit } from '@angular/core';
import { Classroom } from 'src/app/models/Classroom';
import { Course } from 'src/app/models/Course';

interface TimeSlot {
  time: string;
}

interface Class {
  days: string;
  start: number;
  id: number;
  room: number;
}

@Component({
  selector: 'app-solution-timetable',
  templateUrl: './solution-timetable.component.html',
  styleUrls: ['./solution-timetable.component.css']
})
export class SolutionTimetableComponent implements OnInit {
  @Input() xmlData: string = '';
  @Input() courses: Course[] = [];
  @Input() classRooms: Classroom[] = [];

  days: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  timeSlots: TimeSlot[] = [
    { time: '8:00 - 8:55' },
    { time: '8:55 - 9:50' },
    { time: '10:00 - 10:55' },
    { time: '10:55 - 11:50' },
    { time: '12:00 - 12:55' },
    { time: '12:55 - 13:50' },
    { time: '14:00 - 14:55' },
    { time: '14:55 - 15:50' },
    { time: '16:00 - 16:55' },
    { time: '16:55 - 17:50' },
    { time: '18:00 - 18:55' },
    { time: '19:00 - 19:55' },
    { time: '19:55 - 20:50' },
    { time: '21:55 - 22:50' }
  ];

  classes: Class[] = [];
  roomsList: { room: number, classes: Class[] }[] = [];
  // create a variable to store a list of rooms, and for each room, store a list of courses
  // for example: rooms = [{room: 1, courses: [course1, course2]}, {room: 2, courses: [course3, course4]}]

  ngOnInit() {
    console.log("xmlData: " + this.xmlData);
    this.parseXmlData();

    this.roomsList = this.getRoomsList(this.classes);

    console.log("roomsList: ", this.roomsList);
    console.log("courses: ", this.courses);
    console.log("classRooms: ", this.classRooms);
  }

  parseXmlData() {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(this.xmlData, 'text/xml');

    const classElements = xmlDoc.getElementsByTagName('class');
    for (let i = 0; i < classElements.length; i++) {
      const classElement = classElements[i];
      const id = parseInt(classElement.getAttribute('id') || '0');
      const days = classElement.getAttribute('days') || '';
      const start = parseInt(classElement.getAttribute('start') || '0');
      const room = parseInt(classElement.getAttribute('room') || '0');

      this.classes.push({ id, days, start, room });
    }

    console.log("classes: ", this.classes);
  }

  getRoomsList(classes: Class[]): { room: number, classes: Class[] }[] {
    // iterate through classes
    // if room is not in rooms, add it to rooms
    // if room is in rooms, add course to courses of that room

    // [{room: 1, courses: [class1, class2]}, {room: 2, courses: [class3, class4]}]
    let roomsList: { room: number, classes: Class[] }[] = [];

    for (const classItem of classes) {
      let tempClasses = [];
      const room = classItem.room;
      const course = this.courses.find(course => course.id === (classItem.id % 10000)) || new Course();
      console.log("course: ", course);
      console.log("classItem: ", classItem);


      // get how many times 10000 was added to a number in javascript
      const group_index = Math.floor(classItem.id / 10000);

      const grouping = course.groupPeriod

      const group_size = grouping.split(' ')[group_index];

      console.log("--------------------");
      // console.log("classItem: ", classItem);
      // console.log("group_size: ", group_size);
      // console.log("grouping: ", group_index);

      // if group_size is 2, then we need to add 2 courses to tempCourses
      // for each course before adding it to tempCourses, we need to update the start time of the course (add 12 * index of the iteration)
      for (let i = 0; i < parseInt(group_size); i++) {
        const tempClass:Class = {...classItem};
        tempClass.start = tempClass.start + 12 * i;
        tempClasses.push(tempClass);
      }

      // see if room alread exists in roomsList
      const roomIndex = roomsList.findIndex(roomItem => roomItem.room === room);
      console.log("roomIndex: ", roomIndex);

      if (roomIndex == -1) {
        roomsList.push({ room: room, classes: tempClasses });
      } else {
        console.log("roomsList[roomIndex]: ", roomsList[roomIndex]);
        roomsList[roomIndex].classes.push(...tempClasses);
      }
    }

    console.log("roomsList: ", roomsList);
    return roomsList;
  }

  getCourse(day: string, timeslot: TimeSlot, classItem: Class): {course: Course, room: Classroom} | undefined {
    const courseId = this.getCourseId(day, timeslot, classItem) % 10000;

    // get course from courses array
    const course = this.courses.find(course => course.id === courseId);

    const room = this.getRoom(classItem);

    if (!course || !room) { 
      return undefined;
    }

    // in case course is not found
    // return NULL
    return {course, room};
  }

  getRoom(classItem: Class): Classroom | undefined {
    // find classroom with the same id
    const classRoom = this.classRooms.find(classRoom => classRoom.id === classItem.room);

    return classRoom;
  }

  getCourseId(day: string, timeslot: TimeSlot, classItem: Class): number {
    // timeStart = (index of timeSlot in timeSlots + 8) * 12
    const timeStart = (this.timeSlots.indexOf(timeslot) + 8) * 12;

    // if day is Monday then dayIndex = 0
    const dayIndex = this.days.indexOf(day);

    let days = "0000000"; // Initialize days with all zeros

    // Set the corresponding bit to 1 based on dayIndex
    if (dayIndex >= 0 && dayIndex < 7) {
      days = days.substring(0, dayIndex) + "1" + days.substring(dayIndex + 1);
    }

    if (classItem.days === days && classItem.start === timeStart) {
      return classItem.id;
    }
    
    return -1;
  }

  getRoomFromId(id: number): Classroom | undefined {
    return this.classRooms.find(classRoom => classRoom.id === id);
  }
}
