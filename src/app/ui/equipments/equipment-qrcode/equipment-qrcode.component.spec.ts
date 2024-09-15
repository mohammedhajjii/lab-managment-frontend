import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipmentQrcodeComponent } from './equipment-qrcode.component';

describe('EquipmentQrcodeComponent', () => {
  let component: EquipmentQrcodeComponent;
  let fixture: ComponentFixture<EquipmentQrcodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EquipmentQrcodeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EquipmentQrcodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
