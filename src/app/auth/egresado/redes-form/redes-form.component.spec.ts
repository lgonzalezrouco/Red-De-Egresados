import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RedesFormComponent } from './redes-form.component';

describe('RedesFormComponent', () => {
  let component: RedesFormComponent;
  let fixture: ComponentFixture<RedesFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RedesFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RedesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
