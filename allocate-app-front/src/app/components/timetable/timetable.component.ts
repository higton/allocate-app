import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { tableData } from './data';

@Component({
  selector: 'app-timetable',
  templateUrl: './timetable.component.html',
  styleUrls: ['./timetable.component.css']
})
export class TimetableComponent implements OnInit {
  @Input() timeSlots = [];
  @Output() changeTimeSlotsEvent = new EventEmitter();

  selectedCells: string[] = [];
  tableData = JSON.parse(JSON.stringify(tableData)); // deep copy

  constructor() { }

  ngOnInit(): void {
    this.selectCells(this.timeSlots);
  }

  toggleCell(cell: any) {
    cell.selected = !cell.selected;
    if (cell.selected) {
      this.selectedCells.push(cell.id);
    } else {
      const index = this.selectedCells.indexOf(cell.id);
      if (index > -1) {
        this.selectedCells.splice(index, 1);
      }
    }
  }

  sendSelection() {
    const selectedIds = this.selectedCells;
    this.changeTimeSlotsEvent.emit(selectedIds);
  }

  selectCells(timeSlots: string[]) {
    if (!timeSlots.length) {
      return;
    }

    let cells_id = [];
    for (let timeSlot of timeSlots) {
      cells_id.push(timeSlot);
    }

    // iterate over the rows
    for (let row of this.tableData) {
      // iterate over the cells
      for (let cell of row.cells) {
        // if the cell is in the list of selected cells
        if (cells_id.includes(cell.id)) {
          // select the cell
          cell.selected = true;
          // add the cell id to the list of selected cells
          this.selectedCells.push(cell.id);
        }
      }
    }
  }
}
