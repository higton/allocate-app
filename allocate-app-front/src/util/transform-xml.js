const { create, parser } = require('xmlbuilder2');

const timeRangeData = {
    0: ['2m1', '2m2', '2m3', '2m4', '2m5', '2t1', '2t2', '2t3', '2t4', '2t5', '2t6', '2n1', '2n2', '2n3', '2n4'],
    1: ['3m1', '3m2', '3m3', '3m4', '3m5', '3t1', '3t2', '3t3', '3t4', '3t5', '3t6', '3n1', '3n2', '3n3', '3n4'],
    2: ['4m1', '4m2', '4m3', '4m4', '4m5', '4t1', '4t2', '4t3', '4t4', '4t5', '4t6', '4n1', '4n2', '4n3', '4n4'],
    3: ['5m1', '5m2', '5m3', '5m4', '5m5', '5t1', '5t2', '5t3', '5t4', '5t5', '5t6', '5n1', '5n2', '5n3', '5n4'],
    4: ['6m1', '6m2', '6m3', '6m4', '6m5', '6t1', '6t2', '6t3', '6t4', '6t5', '6t6', '6n1', '6n2', '6n3', '6n4'],
    5: ['7m1', '7m2', '7m3', '7m4', '7m5', '7t1', '7t2', '7t3', '7t4', '7t5', '7t6', '7n1', '7n2', '7n3', '7n4'],
};

const timeHourData = {
    'm1': 8,
    'm2': 9,
    'm3': 10,
    'm4': 11,
    'm5': 12,
    't1': 13,
    't2': 14,
    't3': 15,
    't4': 16,
    't5': 17,
    't6': 18,
    'n1': 19,
    'n2': 20,
    'n3': 21,
    'n4': 22,
};


function generateXMLClassrooms(root, classrooms) {
    const xmlClassrooms = root.ele('rooms');

    for (const classroom of classrooms) {
        const classroomElem = xmlClassrooms.ele('room', { id: classroom.id, capacity: classroom.numberOfSeats });

        let sequenceSize = 1;
        let sequenceStartTime = -1;
        let expectedPreviousTimeSlot = undefined;

        let filteredTimeSlots = classroom.timeSlots.filter(timeSlot => timeSlot !== '');

        for (const timeSlot of filteredTimeSlots) {
            // use getTimeSlotDetails to get the day and startTime
            console.log("timeSlot1", timeSlot);
            const [day, startTime, timePosition] = getTimeSlotDetails(timeSlot);


            if (sequenceStartTime === -1) {
                sequenceStartTime = startTime;
            }

            // if last 2 caracters equal "m1", it is the first time slot of the day
            if (timeSlot.endsWith('m1')) {
                const [previousDay, ,] = getTimeSlotDetails(expectedPreviousTimeSlot);

                // add a new xml element with the currect length
                classroomElem.com(` not available on ${getDayDescription(previousDay)} ${getTimeDescription(sequenceStartTime, sequenceSize)} All Weeks `);
                classroomElem.ele('unavailable', {
                    days: getDayCode(previousDay),
                    start: (sequenceStartTime * 12).toString(),
                    length: (grouping[i] * 12).toString(),
                    weeks: '1111111111111',
                    penalty: '0'
                });

                sequenceSize = 1;
                sequenceStartTime = startTime;
                expectedPreviousTimeSlot = timeSlot;
                return;
            }

            const previousTimeSlot = timeRangeData[day][timePosition - 1];

            // if expected previous time slot is equal to the previous time slot
            if (expectedPreviousTimeSlot === previousTimeSlot) {
                sequenceSize++;
            } else if (expectedPreviousTimeSlot !== undefined) {
                // console.log("else different time slot");
                // console.log("expectedPreviousTimeSlot", expectedPreviousTimeSlot);
                // console.log("previousTimeSlot", previousTimeSlot);
                
                const [previousDay, ,] = getTimeSlotDetails(expectedPreviousTimeSlot);

                // add a new xml element with the currect length
                classroomElem.com(` not available on ${getDayDescription(previousDay)} ${getTimeDescription(sequenceStartTime, sequenceSize)} All Weeks `);
                classroomElem.ele('unavailable', {
                    days: getDayCode(previousDay),
                    start: (sequenceStartTime * 12).toString(),
                    length: (sequenceSize * 12).toString(),
                    weeks: '1111111111111',
                    penalty: '0'
                });

                // reset the sequence size
                sequenceSize = 1;
                sequenceStartTime = startTime;
            }

            // if this is the last classroom time slot
            if (timeSlot === classroom.timeSlots[classroom.timeSlots.length - 1]) {
                console.log("timeSlot4", timeSlot);
                const [previousDay, ,] = getTimeSlotDetails(expectedPreviousTimeSlot);

                // add a new xml element with the currect length
                classroomElem.com(` not available on ${getDayDescription(previousDay)} ${getTimeDescription(sequenceStartTime, sequenceSize)} All Weeks `);
                classroomElem.ele('unavailable', {
                    days: getDayCode(previousDay),
                    start: (sequenceStartTime * 12).toString(),
                    length: (sequenceSize * 12).toString(),
                    weeks: '1111111111111',
                    penalty: '0'
                });
            }


            expectedPreviousTimeSlot = timeSlot;
        }
    }
}

function generateXMLCourses(root, courses) {
    let xmlCourses = root.ele('courses');

    for (const course of courses) {
        const courseElem = xmlCourses.ele('course', { id: course.id });
        const configElem = courseElem.ele('config', { id: '1' });

        const grouping = course.groupPeriod.split(' ');
        for (let i = 0; i < grouping.length; i++) {
            const subpartId = `${i + 1}`;
            const subpartElem = configElem.ele('subpart', { id: subpartId });

            const limit = course.localthreshold;
            const classElem = subpartElem.ele('class', { id: course.id+(10000*i), limit: limit.toString() });

            console.log("classElem id: ", course.id+(10000*i));

            for (const classroom of course.classrooms) {
                classElem.ele('room', { id: classroom.id, penalty: '10' });
            }

            let sequenceSize = 1;
            let sequenceStartTime = -1;
            let expectedPreviousTimeSlot = '';
            console.log("timeslots: ", course.timeSlots);
            for (const timeSlot of course.timeSlots) {
                // use getTimeSlotDetails to get the day and startTime
                const [day, startTime, timePosition] = getTimeSlotDetails(timeSlot);


                if (sequenceStartTime === -1) {
                    sequenceStartTime = startTime;
                }

                // if last 2 caracters equal "m1", it is the first time slot of the day
                if (timeSlot.endsWith('m1') && expectedPreviousTimeSlot !== '') {
                    // reset the sequence size
                    const [previousDay, ,] = getTimeSlotDetails(expectedPreviousTimeSlot);

                    // if sequence size is bigger than size of the current grouping:
                    if (sequenceSize >= grouping[i]) {
                        // add a new xml element with the currect length
                        classElem.com(` ${getDayDescription(previousDay)} ${getTimeDescription(sequenceStartTime, sequenceSize)} All Weeks `);
                        classElem.ele('time', {
                            days: getDayCode(previousDay),
                            start: (sequenceStartTime * 12).toString(),
                            length: (grouping[i] * 12).toString(),
                            weeks: '1111111111111',
                            penalty: '0'
                        });
                    }

                    sequenceSize = 1;
                    sequenceStartTime = startTime;
                    expectedPreviousTimeSlot = timeSlot;
                }

                const previousTimeSlot = timeRangeData[day][timePosition - 1];

                // if expected previous time slot is equal to the previous time slot
                if (expectedPreviousTimeSlot === previousTimeSlot) {
                    sequenceSize++;
                } else {
                    // reset the sequence size
                    sequenceSize = 1;
                    sequenceStartTime = startTime;
                }

                // if sequence size is bigger than size of the current grouping:
                if (sequenceSize >= grouping[i]) {
                    const [previousDay, ,] = getTimeSlotDetails(expectedPreviousTimeSlot);

                    // add a new xml element with the currect length
                    classElem.com(` ${getDayDescription(previousDay)} ${getTimeDescription(sequenceStartTime, sequenceSize)} All Weeks `);
                    classElem.ele('time', {
                        days: getDayCode(previousDay),
                        start: (sequenceStartTime * 12).toString(),
                        length: (grouping[i] * 12).toString(),
                        weeks: '1111111111111',
                        penalty: '0'
                    });

                    sequenceStartTime = -1;
                    sequenceSize = 0;
                }

                // if this is the last course time slot
                if (timeSlot === course.timeSlots[course.timeSlots.length - 1]) {
                    // if sequence size is bigger than size of the current grouping:
                    if (sequenceSize >= grouping[i]) {
                        const [previousDay, ,] = getTimeSlotDetails(expectedPreviousTimeSlot);

                        // add a new xml element with the currect length
                        classElem.com(` ${getDayDescription(previousDay)} ${getTimeDescription(sequenceStartTime, sequenceSize)} All Weeks `);
                        classElem.ele('time', {
                            days: getDayCode(previousDay),
                            start: (sequenceStartTime * 12).toString(),
                            length: (grouping[i] * 12).toString(),
                            weeks: '1111111111111',
                            penalty: '0'
                        });
                    }
                }


                expectedPreviousTimeSlot = timeSlot;
            }
        }
    }
}

function getTimeSlotDetails(timeSlot) {
    console.log("getTimeSlotDetails", timeSlot);
    const day = timeSlot.charAt(0) - 2;
    const startTime = timeHourData[timeSlot.substring(1, 3)];

    // get index where the time slot is in the timeRangeData
    const timePosition = timeRangeData[day].indexOf(timeSlot);

    return [day, startTime, timePosition];
}

function getDayCode(day) {
    const days = ['1000000', '0100000', '0010000', '0001000', '0000100', '0000010', '0000001'];
    return days[day];
}

function getDayDescription(day) {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[day];
}

function getTimeDescription(startTime, length) {
    // lengh is in 1 hour intervals
    let startHour = startTime;
    let startMinutes = 0;
    let endHour = startTime + length;
    let endMinutes = 0;

    return `${formatTime(startHour, startMinutes)} - ${formatTime(endHour, endMinutes)}`;
}

function formatTime(hour, minutes) {
    return `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

function generateXMLDistributions(root, courses) {
    let xmlCourses = root.ele('distributions');

    for (const course of courses) {
        const courseElem = xmlCourses.ele('distribution', { type: "NotOverlap", required: "true" });

        const grouping = course.groupPeriod.split(' ');
        for (let i = 0; i < grouping.length; i++) {
            courseElem.ele('class', { id: course.id+(10000*i) });
        }
    }
}

export function generateXMLInputData(courses, classrooms) {
    // console.log('Generating XML input data...');
    // console.log('Courses: ', courses);

    const xmlBuilder = create({ version: '1.0', encoding: 'UTF-8' });
    const rootElement = xmlBuilder
        .ele('problem', {
            'name': 'instance-name',
            'nrDays': '7',
            'slotsPerDay': '288',
            'nrWeeks': '9'
        });

    generateXMLClassrooms(rootElement, classrooms);

    generateXMLCourses(rootElement, courses);
    generateXMLDistributions(rootElement, courses);
    rootElement.ele('students');

    const xmlString = rootElement.end({ pretty: true });
    return xmlString;
}