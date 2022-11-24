import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EurlexFiltersComponent } from './eurlex-filters.component';

describe('EurlexFiltersComponent', () => {
  let component: EurlexFiltersComponent;
  let fixture: ComponentFixture<EurlexFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EurlexFiltersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EurlexFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
