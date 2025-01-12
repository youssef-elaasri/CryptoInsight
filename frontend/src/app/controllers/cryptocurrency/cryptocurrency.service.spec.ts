import { TestBed } from '@angular/core/testing';

import { CryptocurrencyService } from './cryptocurrency.service';

describe('CryptocurrencyService', () => {
  let service: CryptocurrencyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CryptocurrencyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
