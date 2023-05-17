import { Classroom } from "./Classroom";

export class Course {
    name: string = '';
    professor: string = '';
    groupPeriod: string = '';
    department: string = '';
    localthreshold: Number = 10;
    timeSlots: string[] = [];
    classrooms: Classroom[] = [];
    semesterPeriod: Number = 1;
}