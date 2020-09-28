import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarTituloComponent } from './agregar-titulo.component';

describe('AgregarTituloComponent', () => {
  let component: AgregarTituloComponent;
  let fixture: ComponentFixture<AgregarTituloComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgregarTituloComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarTituloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
