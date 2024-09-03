import {AfterViewInit, Component, ElementRef, Input, ViewChild} from '@angular/core';
import {FormControl} from "@angular/forms";
import {MatTooltip} from "@angular/material/tooltip";
import {MatInput} from "@angular/material/input";

@Component({
  selector: 'app-form-input',
  templateUrl: './form-input.component.html',
  styleUrl: './form-input.component.css'
})
export class FormInputComponent {

  @Input() control: FormControl;
  @Input() inputLabel: string;
  @Input() placeholderText: string;
  @Input() inputType: 'text' | 'email' | 'tel' = 'text';
  @Input() tooltipContent: string;
  @Input() tooltipPosition: 'before' | 'after' | 'above' | 'right' | 'left' | 'below' = 'above';
  @Input() errorsHandler: Record<string, string> = {};
  @Input() readOnly: boolean = false;
  @Input() hint: string;
  @Input() textPrefix: string;
  @Input() width: string = '60%';
  @ViewChild(MatTooltip) tooltip: MatTooltip;
  protected readonly Object = Object;



  isInvalid(): boolean {
    return this.control.invalid && this.control.touched;
  }

  tooltipToggle(): void {
    console.log(this.tooltip);
    this.tooltip.toggle();
  }


}
