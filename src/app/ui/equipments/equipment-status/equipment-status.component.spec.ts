import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipmentStatusComponent } from './equipment-status.component';

describe('EquipmentStatusComponent', () => {
  let component: EquipmentStatusComponent;
  let fixture: ComponentFixture<EquipmentStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EquipmentStatusComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EquipmentStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
