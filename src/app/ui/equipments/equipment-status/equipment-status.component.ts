import {Component, Input} from '@angular/core';
import {EquipmentStatus} from "../../../models/equipment.model";

@Component({
  selector: 'app-equipment-status',
  templateUrl: './equipment-status.component.html',
  styleUrl: './equipment-status.component.css'
})
export class EquipmentStatusComponent {
  @Input() status: EquipmentStatus = EquipmentStatus.AVAILABLE;
}
