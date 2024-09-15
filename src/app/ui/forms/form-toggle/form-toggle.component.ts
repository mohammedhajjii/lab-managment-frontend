import {Component, Input, ViewChild} from '@angular/core';
import {FormControl} from "@angular/forms";
import {MatIcon} from "@angular/material/icon";
import {MatTooltip} from "@angular/material/tooltip";

@Component({
  selector: 'app-form-toggle',
  templateUrl: './form-toggle.component.html',
  styleUrl: './form-toggle.component.css'
})
export class FormToggleComponent {

  @Input() control: FormControl;
  @Input() toggleLabel: string;
  @Input() toggleLabelPosition: 'before' | 'after' = 'before';
  @Input() toggleColor: 'primary' | 'accent' | 'warn' = 'primary';
  @Input() tooltipContent: string;
  @Input() tooltipPosition: 'before' | 'after' | 'above' | 'right' | 'left' | 'below' = 'right';
  @Input() width: string = '60%';
  @ViewChild(MatTooltip) tooltip: MatTooltip;



  tooltipToggle(): void {
    console.log(this.tooltip);
    this.tooltip.toggle();
  }

}
