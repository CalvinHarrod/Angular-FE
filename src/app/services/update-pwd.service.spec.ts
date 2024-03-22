import { TestBed } from '@angular/core/testing';

import { UpdatePwdService } from './update-pwd.service';

describe('UpdatePwdService', () => {
  let service: UpdatePwdService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UpdatePwdService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
