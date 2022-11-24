import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetaAdvancedFiltersComponent } from './seta-advanced-filters.component';

describe('SetaAdvancedFiltersComponent', () => {
  let component: SetaAdvancedFiltersComponent;
  let fixture: ComponentFixture<SetaAdvancedFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SetaAdvancedFiltersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SetaAdvancedFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
