declare module 'src/util/timeslot-helper' {
    export class TimeslotHelper {
        static getStandardTimeSlots(): any[];
        static invertTimeSlots(timeSlots: any, standardTimeSlots: any): any[];
    }
}