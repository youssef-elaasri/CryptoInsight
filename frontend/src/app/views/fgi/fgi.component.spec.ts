import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FgiComponent } from './fgi.component';

describe('FgiComponent', () => {
  let component: FgiComponent;
  let fixture: ComponentFixture<FgiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FgiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FgiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
