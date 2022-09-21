import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CorpusOverviewComponent } from './corpus-overview.component';

describe('CorpusOverviewComponent', () => {
  let component: CorpusOverviewComponent;
  let fixture: ComponentFixture<CorpusOverviewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CorpusOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CorpusOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
