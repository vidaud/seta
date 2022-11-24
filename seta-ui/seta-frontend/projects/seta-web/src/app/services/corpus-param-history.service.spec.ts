import { TestBed } from '@angular/core/testing';

import { CorpusParamHistoryService } from './corpus-param-history.service';

describe('CorpusParamHistoryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CorpusParamHistoryService = TestBed.inject(CorpusParamHistoryService);
    expect(service).toBeTruthy();
  });
});
