import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SimilarGraphComponent } from './similar-graph.component';

describe('SimilarGraphComponent', () => {
  let component: SimilarGraphComponent;
  let fixture: ComponentFixture<SimilarGraphComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SimilarGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimilarGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
