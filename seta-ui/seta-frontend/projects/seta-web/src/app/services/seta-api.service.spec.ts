import { TestBed } from '@angular/core/testing';

import { SetaApiService } from './seta-api.service';

describe('SetaApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SetaApiService = TestBed.inject(SetaApiService);
    expect(service).toBeTruthy();
  });
});
