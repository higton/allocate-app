import { tableData } from 'src/app/components/timetable/data.ts';

export class TimeslotHelper {
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

        standardTimeSlots.forEach(timeSlot => {
            if (!timeSlots.includes(timeSlot)) {
                result.push(timeSlot);
            }
        });
    
        return result;
    }
}
