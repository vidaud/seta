import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CirclonTreeComponent } from './circlon-tree.component';

describe('CirclonTreeComponent', () => {
  let component: CirclonTreeComponent;
  let fixture: ComponentFixture<CirclonTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CirclonTreeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CirclonTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
