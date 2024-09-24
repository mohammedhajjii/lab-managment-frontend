import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipmentImageComponent } from './equipment-image.component';

describe('EquipmentImageComponent', () => {
  let component: EquipmentImageComponent;
  let fixture: ComponentFixture<EquipmentImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EquipmentImageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EquipmentImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
