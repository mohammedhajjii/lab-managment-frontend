import {Component, Inject, Input, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {EquipmentImageData, notificationConfig, NotificationData} from "../../../utils/popup.utils";
import {FormFileComponent} from "../../forms/form-file/form-file.component";
import {EquipmentService} from "../../../services/equipment.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {SnackBarComponent} from "../../popup/snack-bar/snack-bar.component";

@Component({
  selector: 'app-equipment-image',
  templateUrl: './equipment-image.component.html',
  styleUrl: './equipment-image.component.css'
})
export class EquipmentImageComponent {

  readonly accept: string[] = ['image/png', 'image/jpeg'];
  image!: File;
  constructor(private equipmentService: EquipmentService,
              private snackBarService: MatSnackBar,
              private dialogRef: MatDialogRef<EquipmentImageComponent>,
              @Inject(MAT_DIALOG_DATA) private data: EquipmentImageData) {}

  onFileChanges(file: File) {
    this.image = file;
  }

  onSaveImage() {
    this.equipmentService
      .setImage(this.data.equipmentId, this.image)
      .subscribe({
        next: equipment => {
          this.dialogRef.close(equipment);
        },
        error: () => {
          this.snackBarService
            .openFromComponent<SnackBarComponent, NotificationData>(
              SnackBarComponent,
              notificationConfig({
                message: 'setting image was failed',
                type: 'error'
              })
            );
          this.dialogRef.close(undefined);
        },
        complete: () => {
          this.snackBarService
            .openFromComponent<SnackBarComponent, NotificationData>(
              SnackBarComponent,
              notificationConfig({
                message: 'image updated successfully',
                type: 'success'
              })
            );
        }
      });

  }

  disabledSaveButton(): boolean{
    return this.image === undefined;
  }


  cancel() {
    this.dialogRef.close(null);
  }
}
