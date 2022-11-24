import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FindAllComponent } from './find-all.component';

describe('FindAllComponent', () => {
  let component: FindAllComponent;
  let fixture: ComponentFixture<FindAllComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FindAllComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FindAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
