import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CfgiComponent } from './cfgi.component';

describe('CfgiComponent', () => {
  let component: CfgiComponent;
  let fixture: ComponentFixture<CfgiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CfgiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CfgiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
