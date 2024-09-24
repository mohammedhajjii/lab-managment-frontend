import {Component, Input} from '@angular/core';
import {FormControl} from "@angular/forms";

@Component({
  selector: 'app-textarea',
  templateUrl: './textarea.component.html',
  styleUrl: './textarea.component.css'
})
export class TextareaComponent {

  @Input() control!: FormControl<string>;
  @Input() label!: string;
  @Input() placeholder!: string;
  @Input() width: string = '100%';
}
