import {Component, OnInit, signal, WritableSignal} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Category, Equipment, EquipmentStatus} from "../../../models/equipment.model";
import {MatDialog} from "@angular/material/dialog";
import {EquipmentQrcodeComponent} from "../equipment-qrcode/equipment-qrcode.component";
import {
  EquipmentImageData,
  equipmentImagePopupConfig,
  qrcodePopupConfig,
  QrCodePopupData, UpdateEquipmentData, updateEquipmentDialogConfig
} from "../../../utils/popup.utils";
import {EquipmentImageComponent} from "../equipment-image/equipment-image.component";
import {EquipmentService} from "../../../services/equipment.service";
import {UpdateEquipmentComponent} from "../update-equipment/update-equipment.component";



@Component({
  selector: 'app-equipment-details',
  templateUrl: './equipment-details.component.html',
  styleUrl: './equipment-details.component.css'
})
export class EquipmentDetailsComponent implements OnInit{

  equipment: WritableSignal<Equipment | undefined> =
    signal<Equipment | undefined>(undefined);

  categories!: Category[];

  protected readonly EquipmentStatus = EquipmentStatus;


  constructor(private activatedRoute: ActivatedRoute,
              private equipmentService: EquipmentService,
              private dialogService: MatDialog) {
  }

  ngOnInit(): void {

    this.activatedRoute.data.subscribe({
      next: data => {
        this.equipment.set(data['equipment'] as Equipment);
        this.categories = data['categories'] as Category[];
      }
    });

  }

  openQrCodeDialog() {
    this.dialogService
      .open<EquipmentQrcodeComponent, QrCodePopupData, void>(
        EquipmentQrcodeComponent,
        qrcodePopupConfig({
          name: `${this.equipment().name}`,
          qrcode: this.equipment().qrcode
        })
      );
  }

  openImageUploader() {
    const imageUploaderRef = this.dialogService
      .open<EquipmentImageComponent, EquipmentImageData, Equipment>(
        EquipmentImageComponent,
        equipmentImagePopupConfig({
          equipmentId: this.equipment().id
        })
      );

    imageUploaderRef.afterClosed()
      .subscribe({
        next: equipment => {
          if (equipment) this.equipment.set(equipment);
          else console.log('cancelled');
        }
      });
  }

  refreshEquipmentDetails(): void{
    this.equipmentService.get(this.equipment().id)
      .subscribe({
        next: equipment => {
          this.equipment.set(equipment);
        }
      });
  }

  openUpdateDialog() {
    const updateDialogRef = this.dialogService
      .open<UpdateEquipmentComponent, UpdateEquipmentData, Equipment>(
        UpdateEquipmentComponent,
        updateEquipmentDialogConfig({
          equipment: this.equipment(),
          categories: this.categories
        })
      );

    updateDialogRef.afterClosed()
      .subscribe({
        next: equipment => {
          if (equipment) this.equipment.set(equipment);
        }
      });
  }


}
