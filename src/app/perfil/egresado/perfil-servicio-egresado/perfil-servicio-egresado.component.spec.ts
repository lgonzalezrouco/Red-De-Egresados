import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilServicioEgresadoComponent } from './perfil-servicio-egresado.component';

describe('PerfilServicioEgresadoComponent', () => {
  let component: PerfilServicioEgresadoComponent;
  let fixture: ComponentFixture<PerfilServicioEgresadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PerfilServicioEgresadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PerfilServicioEgresadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
