import {Component, Input, signal, ViewChild} from '@angular/core';
import {FormControl} from "@angular/forms";
import {MatTooltip} from "@angular/material/tooltip";
import {PasswordService} from "../../../services/password.service";

@Component({
  selector: 'app-form-password',
  templateUrl: './form-password.component.html',
  styleUrl: './form-password.component.css'
})
export class FormPasswordComponent {

  @Input() control: FormControl<string>;
  @Input() inputLabel: string;
  @Input() hint: string;
  @Input() errorsHandler: Record<string, string> = {};
  @Input() tooltipContent: string;
  @Input() tooltipPosition: 'before' | 'after' | 'above' | 'right' | 'left' | 'below' = 'right';
  @Input() width: string = '60%';
  @ViewChild(MatTooltip) tooltip: MatTooltip;

  protected readonly Object = Object;
  hide = signal(true);


  constructor(private passwordGenerator: PasswordService) {
  }

  toggle(): void{
    this.hide.set(!this.hide());
  }

  tooltipToggle() {
    this.tooltip.toggle();
  }


  generatePassword(){
    this.control.setValue(this.passwordGenerator.generatePassword());
  }

}
