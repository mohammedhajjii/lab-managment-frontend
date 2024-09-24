import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipmentStateComponent } from './equipment-state.component';

describe('EquipmentStateComponent', () => {
  let component: EquipmentStateComponent;
  let fixture: ComponentFixture<EquipmentStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EquipmentStateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EquipmentStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
