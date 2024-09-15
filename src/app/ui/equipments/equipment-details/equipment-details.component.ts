import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Equipment} from "../../../models/equipment.model";
import {MatDialog} from "@angular/material/dialog";
import {EquipmentQrcodeComponent} from "../equipment-qrcode/equipment-qrcode.component";
import {qrcodePopupConfig, QrCodePopupData} from "../../../utils/popup.utils";



@Component({
  selector: 'app-equipment-details',
  templateUrl: './equipment-details.component.html',
  styleUrl: './equipment-details.component.css'
})
export class EquipmentDetailsComponent implements OnInit{

  equipment!: Equipment;

  constructor(private activatedRoute: ActivatedRoute,
              private dialogService: MatDialog) {
  }

  ngOnInit(): void {

    this.activatedRoute.data.subscribe({
      next: data => {
        this.equipment = data['equipment'];
        console.log(this.equipment);
      }
    });
  }

  openQrCodeDialog() {
    this.dialogService
      .open<EquipmentQrcodeComponent, QrCodePopupData, void>(
        EquipmentQrcodeComponent,
        qrcodePopupConfig({
          name: `${this.equipment.name}`,
          qrcode: this.equipment.qrcode
        })
      );
  }
}
