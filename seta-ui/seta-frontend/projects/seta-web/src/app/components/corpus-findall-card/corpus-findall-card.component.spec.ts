import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CorpusFindallCardComponent } from './corpus-findall-card.component';

describe('CorpusFindallCardComponent', () => {
  let component: CorpusFindallCardComponent;
  let fixture: ComponentFixture<CorpusFindallCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CorpusFindallCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CorpusFindallCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
