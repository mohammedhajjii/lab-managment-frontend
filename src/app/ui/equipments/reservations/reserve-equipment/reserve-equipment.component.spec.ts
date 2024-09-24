import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReserveEquipmentComponent } from './reserve-equipment.component';

describe('ReserveEquipmentComponent', () => {
  let component: ReserveEquipmentComponent;
  let fixture: ComponentFixture<ReserveEquipmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReserveEquipmentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReserveEquipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
