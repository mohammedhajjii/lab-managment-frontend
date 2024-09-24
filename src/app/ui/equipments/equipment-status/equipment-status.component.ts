import {Component, input, model, ModelSignal} from '@angular/core';
import {EquipmentStatus} from "../../../models/equipment.model";

@Component({
  selector: 'app-equipment-status',
  templateUrl: './equipment-status.component.html',
  styleUrl: './equipment-status.component.css'
})
export class EquipmentStatusComponent{

  status = input<EquipmentStatus>(EquipmentStatus.AVAILABLE);

  protected readonly EquipmentStatus = EquipmentStatus;

}
