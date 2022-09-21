import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchCorpusChipsComponent } from './search-corpus-chips.component';

describe('SearchCorpusChipsComponent', () => {
  let component: SearchCorpusChipsComponent;
  let fixture: ComponentFixture<SearchCorpusChipsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchCorpusChipsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchCorpusChipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
