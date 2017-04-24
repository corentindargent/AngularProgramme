import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewShapesComponent } from './new-shapes.component';

describe('NewShapesComponent', () => {
  let component: NewShapesComponent;
  let fixture: ComponentFixture<NewShapesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewShapesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewShapesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
