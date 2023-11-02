import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TquanComponent } from './tquan.component';

describe('TquanComponent', () => {
  let component: TquanComponent;
  let fixture: ComponentFixture<TquanComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TquanComponent]
    });
    fixture = TestBed.createComponent(TquanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
