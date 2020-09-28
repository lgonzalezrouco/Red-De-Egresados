import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaitVerificationComponent } from './wait-verification.component';

describe('WaitVerificationComponent', () => {
  let component: WaitVerificationComponent;
  let fixture: ComponentFixture<WaitVerificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaitVerificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaitVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
