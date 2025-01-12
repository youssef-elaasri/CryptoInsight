import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CryptocurrencyComponent } from './cryptocurrency.component';

describe('CryptocurrencyComponent', () => {
  let component: CryptocurrencyComponent;
  let fixture: ComponentFixture<CryptocurrencyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CryptocurrencyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CryptocurrencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
