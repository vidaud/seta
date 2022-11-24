import { TestBed } from '@angular/core/testing';

import { RsaKeysService } from './rsa-keys.service';

describe('RsaKeysService', () => {
  let service: RsaKeysService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RsaKeysService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
