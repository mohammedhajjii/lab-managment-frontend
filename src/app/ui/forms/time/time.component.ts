import {Component, Input} from '@angular/core';
import {FormControl} from "@angular/forms";

@Component({
  selector: 'app-time',
  templateUrl: './time.component.html',
  styleUrl: './time.component.css'
})
export class TimeComponent {

  @Input() control!: FormControl<string>;
  @Input() label!: string;
  @Input() placeholder!: string;
  @Input() width: string = '100%';


  isInvalid(): boolean {
    return this.control.invalid && this.control.touched;
  }
}
