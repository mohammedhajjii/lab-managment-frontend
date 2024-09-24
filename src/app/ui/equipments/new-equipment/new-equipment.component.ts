import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {EquipmentFormGroup, getControl, Mappers} from "../../../utils/controls.template";
import {equipmentAsyncValidator} from "../../../validators/equipment.async.validators";
import {EquipmentService} from "../../../services/equipment.service";
import {Equipment} from "../../../models/equipment.model";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {EquipmentPopupData, notificationConfig, NotificationData} from "../../../utils/popup.utils";
import {MatSnackBar} from "@angular/material/snack-bar";
import {SnackBarComponent} from "../../popup/snack-bar/snack-bar.component";

@Component({
  selector: 'app-new-equipment',
  templateUrl: './new-equipment.component.html',
  styleUrl: './new-equipment.component.css'
})
export class NewEquipmentComponent implements OnInit{

  protected readonly getControl = getControl;
  protected readonly Mappers = Mappers;
  formGroup!: FormGroup<EquipmentFormGroup>;

  constructor(private equipmentService: EquipmentService,
              private newEquipmentDialogRef: MatDialogRef<NewEquipmentComponent>,
              @Inject(MAT_DIALOG_DATA) public data: EquipmentPopupData,
              private snackBarService: MatSnackBar) {
  }

  ngOnInit(): void {

    this.formGroup = new FormGroup<EquipmentFormGroup>({
      name: new FormControl<string>(null, {
        validators: Validators.required,
        asyncValidators: equipmentAsyncValidator(this.equipmentService)
      }),
      image: new FormControl<Blob>(null, {
        validators: Validators.required
      }),
      restricted: new FormControl<boolean>(false, {
        validators: Validators.required
      }),
      categoryId: new FormControl<number>(null, {
        validators: Validators.required
      })
    });

  }


  onFileChanges(file: File) {
    getControl(this.formGroup, 'image')
      .setValue(file);
  }


  createEquipment(): void {

    const equipment: Equipment = this.formGroup.getRawValue() as Equipment;
    this.equipmentService.create(equipment)
      .subscribe({
        next: value => {
          this.newEquipmentDialogRef.close(value);
        },
        error: err => {
          this.snackBarService
            .openFromComponent<SnackBarComponent, NotificationData>(
              SnackBarComponent,
              notificationConfig({
                type: 'error',
                message: err.message
              })
            );
          this.newEquipmentDialogRef.close(undefined);
        },
        complete: () => {
          this.snackBarService
            .openFromComponent<SnackBarComponent, NotificationData>(
              SnackBarComponent,
              notificationConfig({
                type: 'success',
                message: 'equipment created successfully'
              })
            );
        }
      });
  }

  cancel() {
    this.newEquipmentDialogRef.close(undefined);
  }
}

