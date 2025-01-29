import { TestBed } from '@angular/core/testing';

import { CfgiService } from './cfgi.service';

describe('CfgiService', () => {
  let service: CfgiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CfgiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
