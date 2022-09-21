import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TickDocumentComponent } from './tick-document.component';

describe('TickDocumentComponent', () => {
  let component: TickDocumentComponent;
  let fixture: ComponentFixture<TickDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TickDocumentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TickDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
