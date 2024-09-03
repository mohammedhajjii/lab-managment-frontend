import {Component, Input} from '@angular/core';
import {Params} from "@angular/router";

@Component({
  selector: 'app-nav-item',
  templateUrl: './nav-item.component.html',
  styleUrl: './nav-item.component.css'
})
export class NavItemComponent {
  @Input() navItemDetails: NavItemDetails;
}


export interface NavItemDetails{
  itemIcon: string;
  itemLabel: string;
  forRoute: string | string[];
  qParams?: Params;
  onlyFor?: string[];
}
