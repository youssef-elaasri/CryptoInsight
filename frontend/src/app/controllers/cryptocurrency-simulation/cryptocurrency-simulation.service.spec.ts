import { TestBed } from '@angular/core/testing';

import { CryptocurrencySimulationService } from './cryptocurrency-simulation.service';

describe('CryptocurrencySimulationService', () => {
  let service: CryptocurrencySimulationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CryptocurrencySimulationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
