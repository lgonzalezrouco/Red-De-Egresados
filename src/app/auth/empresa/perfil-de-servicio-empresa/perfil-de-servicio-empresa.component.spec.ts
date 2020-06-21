import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilDeServicioEmpresaComponent } from './perfil-de-servicio-empresa.component';

describe('PerfilDeServicioEmpresaComponent', () => {
  let component: PerfilDeServicioEmpresaComponent;
  let fixture: ComponentFixture<PerfilDeServicioEmpresaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PerfilDeServicioEmpresaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PerfilDeServicioEmpresaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
