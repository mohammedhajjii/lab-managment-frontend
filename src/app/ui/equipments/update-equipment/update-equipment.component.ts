import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {getControl, Mapper, Mappers, UpdateEquipmentFormGroup} from "../../../utils/controls.template";
import {EquipmentService} from "../../../services/equipment.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {notificationConfig, NotificationData, UpdateEquipmentData} from "../../../utils/popup.utils";
import {equipmentAsyncValidator} from "../../../validators/equipment.async.validators";
import {Equipment, EquipmentStatus} from "../../../models/equipment.model";
import {MatSnackBar} from "@angular/material/snack-bar";
import {SnackBarComponent} from "../../popup/snack-bar/snack-bar.component";

@Component({
  selector: 'app-update-equipment',
  templateUrl: './update-equipment.component.html',
  styleUrl: './update-equipment.component.css'
})
export class UpdateEquipmentComponent implements OnInit{

  formGroup!: FormGroup<UpdateEquipmentFormGroup>;
  readonly allStatus: EquipmentStatus[] = [
    EquipmentStatus.AVAILABLE,
    EquipmentStatus.OUT_OF_SERVICE,
    EquipmentStatus.DECOMMISSIONED
  ];
  readonly statusLabelMapper: Mapper<EquipmentStatus, string> =
    st => st as string;
  readonly statusValueMapper: Mapper<EquipmentStatus, string> =
    st => st;

  protected readonly Mappers = Mappers;


  constructor(private equipmentService: EquipmentService,
              private updateDialogRef: MatDialogRef<UpdateEquipmentComponent>,
              private snackBareService: MatSnackBar,
              @Inject(MAT_DIALOG_DATA) public data: UpdateEquipmentData) {
  }


  get name(): FormControl<string>{
    return getControl(this.formGroup, 'name');
  }

  get status(): FormControl<EquipmentStatus>{
    return getControl(this.formGroup, 'status');
  }

  get restricted(): FormControl<boolean>{
    return getControl(this.formGroup, 'restricted');
  }

  get category(): FormControl<number>{
    return getControl(this.formGroup, 'categoryId');
  }

  ngOnInit(): void {

    this.formGroup = new FormGroup<UpdateEquipmentFormGroup>({
      name: new FormControl<string>(this.data.equipment.name, {
        validators: Validators.required,
        asyncValidators: equipmentAsyncValidator(this.equipmentService, this.data.equipment.id)
      }),
      status: new FormControl<EquipmentStatus>(this.data.equipment.status, {
        validators: Validators.required
      }),
      restricted: new FormControl<boolean>(this.data.equipment.restricted),
      categoryId: new FormControl<number>(this.data.equipment.category.id, {
        validators: Validators.required
      })
    });

    this.formGroup.statusChanges.subscribe({
      next: status => {
        console.log('status: ' + status);
        console.log('dirty: ' + this.formGroup.dirty);
        console.log('touched: ' + this.formGroup.touched);
      }
    });


  }

  onEquipmentStatusChanges(newStatus: EquipmentStatus) {
    this.status.setValue(newStatus);
  }

  onStateChanges(newState: boolean) {
    this.restricted.setValue(newState);
  }

  disableSaveButton(): boolean {
    return (!this.formGroup.touched) || (this.formGroup.touched && this.formGroup.invalid);
  }

  cancel() {
    this.updateDialogRef.close(undefined);
  }

  saveEquipment() {

    const equipment: Equipment = {
      ...this.data.equipment,
      ...this.formGroup.getRawValue()
    };

    console.log(equipment);
    this.equipmentService.update(equipment)
      .subscribe({
        next: equipment => {
          this.updateDialogRef.close(equipment);
        },
        error: err => {
          this.snackBareService
            .openFromComponent<SnackBarComponent, NotificationData>(
              SnackBarComponent,
              notificationConfig({
                message: err.message,
                type: 'error'
              })
            );
          this.updateDialogRef.close(undefined);
        },
        complete: () => {
          this.snackBareService
            .openFromComponent<SnackBarComponent, NotificationData>(
              SnackBarComponent,
              notificationConfig({
                message: 'equipment updated successfully',
                type: 'success'
              })
            );
        }

      });

  }

}
