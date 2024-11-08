import { TestBed } from '@angular/core/testing';

import { RequestsessionIDService } from './requestsession-id.service';

describe('RequestsessionIDService', () => {
  let service: RequestsessionIDService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RequestsessionIDService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
