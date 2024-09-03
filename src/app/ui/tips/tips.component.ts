import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-tips',
  templateUrl: './tips.component.html',
  styleUrl: './tips.component.css'
})
export class TipsComponent {

  @Input() tips!: string;
  @Input() icon:  string = 'info_outline';
}
