import { TestBed } from '@angular/core/testing';

import { ExternalAuthService } from './external-auth.service';

describe('ExternalAuthService', () => {
  let service: ExternalAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExternalAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
