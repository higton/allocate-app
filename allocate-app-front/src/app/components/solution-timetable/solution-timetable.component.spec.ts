import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolutionTimetableComponent } from './solution-timetable.component';

describe('SolutionTimetableComponent', () => {
  let component: SolutionTimetableComponent;
  let fixture: ComponentFixture<SolutionTimetableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SolutionTimetableComponent]
    });
    fixture = TestBed.createComponent(SolutionTimetableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
