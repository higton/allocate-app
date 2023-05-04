import { Classroom } from "./Classroom";

export class Course {
    name: string;
    professor: string;
    groupPeriod: string;
    department: string;
    localthreshold: Number;
    timeSlots: string[];
    classrooms: Classroom[];
}