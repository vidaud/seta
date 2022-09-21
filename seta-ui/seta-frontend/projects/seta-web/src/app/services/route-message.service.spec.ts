import { TestBed } from '@angular/core/testing';

import { RouteMessageService } from './route-message.service';

describe('RouteMessageService', () => {
  let service: RouteMessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RouteMessageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
