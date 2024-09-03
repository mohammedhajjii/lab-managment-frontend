import {Component, Inject} from '@angular/core';
import {MAT_SNACK_BAR_DATA, MatSnackBarRef} from "@angular/material/snack-bar";

@Component({
  selector: 'app-snack-bar',
  templateUrl: './snack-bar.component.html',
  styleUrl: './snack-bar.component.css'
})
export class SnackBarComponent {

  constructor(private snackBarRef: MatSnackBarRef<SnackBarComponent>,
              @Inject(MAT_SNACK_BAR_DATA) public data:
                {operation: string, success: boolean}) {}


  hideNotification() {
    this.snackBarRef.dismiss();
  }
}
