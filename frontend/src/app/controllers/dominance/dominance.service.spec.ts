import { TestBed } from '@angular/core/testing';

import { DominanceService } from './dominance.service';

describe('DominanceService', () => {
  let service: DominanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DominanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
