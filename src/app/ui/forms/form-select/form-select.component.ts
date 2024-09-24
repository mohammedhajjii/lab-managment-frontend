import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {FormControl} from "@angular/forms";
import {MatTooltip} from "@angular/material/tooltip";
import {Mapper} from "../../../utils/controls.template";

@Component({
  selector: 'app-form-select',
  templateUrl: './form-select.component.html',
  styleUrl: './form-select.component.css'
})
export class FormSelectComponent<T, R extends T[keyof T]> implements OnInit{

  @Input() control: FormControl<R>;
  @Input() selectLabel: string;
  @Input() selected: R;
  @Input() tooltipContent: string;
  @Input() tooltipPosition: 'before' | 'after' | 'above' | 'right' | 'left' | 'below' = 'above';
  @Input() hint: string;
  @Input() errorsHandler: Record<string, string>;
  @Input() dataSource: T[];
  @Input() valueMapper: Mapper<T, R>
  @Input() labelMapper: Mapper<T, any>;
  @Input() width: string = '60%';
  @Input() focus: boolean = false;
  @ViewChild(MatTooltip) tooltip: MatTooltip;


  isInvalid(): boolean {
    return this.control.invalid && this.control.touched;
  }

  tooltipToggle(): void {
    this.tooltip.toggle();
  }

  protected readonly Object = Object;


  ngOnInit(): void {
    if (this.selected){
      this.control.setValue(this.selected);
    }
  }
}


