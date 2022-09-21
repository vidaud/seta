import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryStoreTreeComponent } from './query-store-tree.component';

describe('QueryStoreTreeComponent', () => {
  let component: QueryStoreTreeComponent;
  let fixture: ComponentFixture<QueryStoreTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QueryStoreTreeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QueryStoreTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
