import {Component, Input, OnInit} from '@angular/core';
import {Field, FieldSetTemplate, FieldSet} from "../../../utils/field.utils";

@Component({
  selector: 'app-field-group',
  templateUrl: './field-group.component.html',
  styleUrl: './field-group.component.css'
})
export class FieldGroupComponent<T extends FieldSetTemplate<T>>{
  @Input() groupName!: string;
  @Input() fieldSet!: FieldSet<T>;

  fieldIsTouched() {
    this.fieldSet.touched = true;
  }
}
