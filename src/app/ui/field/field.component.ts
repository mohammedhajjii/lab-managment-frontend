import {Component, Input, Output, setTestabilityGetter} from '@angular/core';
import {EditFieldDialogComponent} from "../popup/edit-field-dialog/edit-field-dialog.component";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {Field} from "../../utils/field.utils";
import {Subject} from "rxjs";

@Component({
  selector: 'app-field',
  templateUrl: './field.component.html',
  styleUrl: './field.component.css'
})
export class FieldComponent<T = any, R extends (T | T[keyof T]) = T> {


  @Input() field!: Field<T, R>;
  @Output() touched: Subject<void> = new Subject<void>();
  fieldDialogRef!: MatDialogRef<EditFieldDialogComponent<T, R>>;

  constructor(private dialogService: MatDialog) {
  }

  openFieldDialog(field: Field<T, R>) {
    this.fieldDialogRef = this.dialogService.open<EditFieldDialogComponent<T, R>, Field<T, R>, R>(EditFieldDialogComponent<T, R>, {
      disableClose: true,
      autoFocus: true,
      minWidth: '35%',
      data: field
    });


    this.fieldDialogRef.afterClosed().subscribe({
      next: (returnedValue: R) => {
        if (returnedValue !== this.field.value){
          //raise the touched event
          this.touched.next();
          this.field.value = returnedValue;
        }
      }
    });


  }
}
