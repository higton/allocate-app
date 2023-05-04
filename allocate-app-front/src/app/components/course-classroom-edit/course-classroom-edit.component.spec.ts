import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseClassroomEditComponent } from './course-classroom-edit.component';

describe('CourseClassroomEditComponent', () => {
  let component: CourseClassroomEditComponent;
  let fixture: ComponentFixture<CourseClassroomEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourseClassroomEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseClassroomEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
