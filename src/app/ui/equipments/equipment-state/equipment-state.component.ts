import {Component, input, model} from '@angular/core';
import {MatChipListboxChange} from "@angular/material/chips";

@Component({
  selector: 'app-equipment-state',
  templateUrl: './equipment-state.component.html',
  styleUrl: './equipment-state.component.css'
})
export class EquipmentStateComponent {

  state = input<boolean>(false);

}
