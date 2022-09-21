import { TestBed } from '@angular/core/testing';

import { CorpusCentralService } from './corpus-central.service';

describe('CorpusCentralService', () => {
  let service: CorpusCentralService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CorpusCentralService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
