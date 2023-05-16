import { tableData } from 'src/app/components/timetable/data.ts';

export class TimeSlotHelper {
    static getStandardTimeSlots() {
        let standardTimeSlots = [];

        for (let i = 0; i < 6; i++) {
            for (let row = 0; row < tableData.length; row++) {
                standardTimeSlots.push(tableData[row].cells[i].id);
            }
        }

        return standardTimeSlots;
    }

    static invertTimeSlots(timeSlots, standardTimeSlots) {
        let result = [];

        console.log("timeSlots: ", timeSlots);
        console.log("standardTimeSlots: ", standardTimeSlots);
        // iterate over the standard array of time slots
        //  - if the time slot is not in the standard list of time slots, add it to the new array of time slots
        standardTimeSlots.forEach(timeSlot => {
            if (!timeSlots.includes(timeSlot)) {
                result.push(timeSlot);
            }
        });
    
        return result;
    }
}
