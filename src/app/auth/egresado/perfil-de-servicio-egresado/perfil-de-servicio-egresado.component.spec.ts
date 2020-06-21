import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilDeServicioEgresadoComponent } from './perfil-de-servicio-egresado.component';

describe('PerfilDeServicioEgresadoComponent', () => {
  let component: PerfilDeServicioEgresadoComponent;
  let fixture: ComponentFixture<PerfilDeServicioEgresadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PerfilDeServicioEgresadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PerfilDeServicioEgresadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
