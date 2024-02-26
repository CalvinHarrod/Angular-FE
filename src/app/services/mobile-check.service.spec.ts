import { TestBed } from '@angular/core/testing';

import { MobileCheckService } from './mobile-check.service';

describe('MobileCheckService', () => {
  let service: MobileCheckService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MobileCheckService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
