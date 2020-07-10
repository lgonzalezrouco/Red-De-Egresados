import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeEgresadoComponent } from './home-egresado.component';

describe('HomeEgresadoComponent', () => {
  let component: HomeEgresadoComponent;
  let fixture: ComponentFixture<HomeEgresadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeEgresadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeEgresadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
