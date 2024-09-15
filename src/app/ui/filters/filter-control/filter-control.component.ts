import {Component, Input} from '@angular/core';
import {FilterControl} from "../../../utils/filters.utils";

@Component({
  selector: 'app-filter-control',
  templateUrl: './filter-control.component.html',
  styleUrl: './filter-control.component.css'
})
export class FilterControlComponent {
  @Input() filterControl!: FilterControl;
}
