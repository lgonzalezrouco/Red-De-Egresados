import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EgresadoRegisterComponent } from './egresado-register.component';

describe('EgresadoRegisterComponent', () => {
  let component: EgresadoRegisterComponent;
  let fixture: ComponentFixture<EgresadoRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EgresadoRegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EgresadoRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
