import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CorpusListComponent } from './corpus-list.component';

describe('SearchAllComponent', () => {
  let component: CorpusListComponent;
  let fixture: ComponentFixture<CorpusListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CorpusListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CorpusListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
