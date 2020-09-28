import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilEgresadoComponent } from './perfil-egresado.component';

describe('PerfilEgresadoComponent', () => {
  let component: PerfilEgresadoComponent;
  let fixture: ComponentFixture<PerfilEgresadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PerfilEgresadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PerfilEgresadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
