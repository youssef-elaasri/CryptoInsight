import { TestBed } from '@angular/core/testing';

import { CoinSimulationServiceService } from './coin-simulation-service.service';

describe('CoinSimulationServiceService', () => {
  let service: CoinSimulationServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CoinSimulationServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
