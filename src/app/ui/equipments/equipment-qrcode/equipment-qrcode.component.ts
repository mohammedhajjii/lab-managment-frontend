import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {QrCodePopupData} from "../../../utils/popup.utils";

@Component({
  selector: 'app-equipment-qrcode',
  templateUrl: './equipment-qrcode.component.html',
  styleUrl: './equipment-qrcode.component.css'
})
export class EquipmentQrcodeComponent {

  downloadName!: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: QrCodePopupData) {
    this.downloadName = data.name.concat('.png');
  }

}
