import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FestivalDetailComponent } from './festival-detail.component';

describe('FestivalDetailComponent', () => {
  let component: FestivalDetailComponent;
  let fixture: ComponentFixture<FestivalDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FestivalDetailComponent]
    });
    fixture = TestBed.createComponent(FestivalDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
