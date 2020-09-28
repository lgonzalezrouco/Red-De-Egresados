import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilServicioEmpresaComponent } from './perfil-servicio-empresa.component';

describe('PerfilServicioEmpresaComponent', () => {
  let component: PerfilServicioEmpresaComponent;
  let fixture: ComponentFixture<PerfilServicioEmpresaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PerfilServicioEmpresaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PerfilServicioEmpresaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
