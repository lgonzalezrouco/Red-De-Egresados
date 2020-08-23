import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarExperienciasComponent } from './agregar-experiencias.component';

describe('AgregarExperienciasComponent', () => {
  let component: AgregarExperienciasComponent;
  let fixture: ComponentFixture<AgregarExperienciasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgregarExperienciasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarExperienciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
