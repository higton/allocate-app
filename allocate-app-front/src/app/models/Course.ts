import { Classroom } from "./Classroom";

export class Course {
    id: Number = 0;
    name: string = '';
    professor: string = '';
    groupPeriod: string = '';
    department: string = '';
    localthreshold: Number = 10;
    timeSlots: string[] = [];
    classrooms: Classroom[] = [];
    semesterPeriod: Number = 1;
    seatCount: number = 0;
}