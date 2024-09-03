import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {ConfirmDialogData} from "../../../utils/popup.utils";

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrl: './confirm.component.css'
})
export class ConfirmComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public confirmDialogData: ConfirmDialogData) {
  }

}
