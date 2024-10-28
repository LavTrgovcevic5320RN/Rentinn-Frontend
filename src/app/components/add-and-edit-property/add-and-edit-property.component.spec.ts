import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAndEditPropertyComponent } from './add-and-edit-property.component';

describe('AddAndEditPropertyComponent', () => {
  let component: AddAndEditPropertyComponent;
  let fixture: ComponentFixture<AddAndEditPropertyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddAndEditPropertyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddAndEditPropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
