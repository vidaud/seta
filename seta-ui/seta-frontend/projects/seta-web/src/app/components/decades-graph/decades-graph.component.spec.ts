import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DecadesGraphComponent } from './decades-graph.component';

describe('DecadesGraphComponent', () => {
  let component: DecadesGraphComponent;
  let fixture: ComponentFixture<DecadesGraphComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DecadesGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DecadesGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
