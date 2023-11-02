import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookedTourComponent } from './booked-tour.component';

describe('BookedTourComponent', () => {
  let component: BookedTourComponent;
  let fixture: ComponentFixture<BookedTourComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BookedTourComponent]
    });
    fixture = TestBed.createComponent(BookedTourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
