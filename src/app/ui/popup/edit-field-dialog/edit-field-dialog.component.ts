import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {Field} from "../../../utils/field.utils";
import {FormControl} from "@angular/forms";

@Component({
  selector: 'app-edit-field-dialog',
  templateUrl: './edit-field-dialog.component.html',
  styleUrl: './edit-field-dialog.component.css'
})
export class EditFieldDialogComponent<T = any, R extends (T | T[keyof T]) = T> implements OnInit{
  origin!: R;
  control!: FormControl<R>;

  constructor(@Inject(MAT_DIALOG_DATA) public field: Field<T, R>) {
  }

  ngOnInit(): void {
    this.origin = this.field.value;
    this.control = new FormControl<R>(this.origin, {
      validators: this.field.validators,
      asyncValidators: this.field.asyncValidators
    });
  }
}


