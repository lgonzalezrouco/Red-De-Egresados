import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EleccionRegisterComponent } from './eleccion-register.component';

describe('EleccionRegisterComponent', () => {
  let component: EleccionRegisterComponent;
  let fixture: ComponentFixture<EleccionRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EleccionRegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EleccionRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
