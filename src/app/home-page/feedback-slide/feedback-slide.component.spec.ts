import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackSlideComponent } from './feedback-slide.component';

describe('FeedbackSlideComponent', () => {
  let component: FeedbackSlideComponent;
  let fixture: ComponentFixture<FeedbackSlideComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FeedbackSlideComponent]
    });
    fixture = TestBed.createComponent(FeedbackSlideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
