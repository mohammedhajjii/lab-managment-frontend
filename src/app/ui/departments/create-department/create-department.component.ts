import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, Validators} from "@angular/forms";
import {departmentNameExistsValidator} from "../../../validators/department.async.validators";
import {DepartmentService} from "../../../services/department.service";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {
  DepartmentCreationStatus,
  DepartmentPopupData,
  notificationConfig,
  NotificationData
} from "../../../utils/popup.utils";
import {iif} from "rxjs";
import {departmentsResolver} from "../../../resolvers/departmentsResolver";
import {MatSnackBar} from "@angular/material/snack-bar";
import {SnackBarComponent} from "../../popup/snack-bar/snack-bar.component";

@Component({
  selector: 'app-create-department',
  templateUrl: './create-department.component.html',
  styleUrl: './create-department.component.css'
})
export class CreateDepartmentComponent implements OnInit{

  protected readonly DepartmentCreationStatus = DepartmentCreationStatus;
  departmentName!: FormControl<string>;

  constructor(private departmentService: DepartmentService,
              private snackBarService: MatSnackBar,
              @Inject(MAT_DIALOG_DATA) public dialogData: DepartmentPopupData) {
  }

  ngOnInit(): void {
    this.departmentName = new FormControl(this.dialogData.deptName,
      {
      validators: Validators.required,
      asyncValidators: departmentNameExistsValidator(this.departmentService)
    });
  }

  invalid(): boolean {
    return  this.departmentName.invalid;
  }

  done(): void{
    iif(
      () => this.dialogData.mode === 'create',
      this.departmentService.createDepartment(this.departmentName.value),
      this.departmentService.updateDepartment(this.dialogData.deptId, this.departmentName.value)
    ).subscribe({
      error: err => {
        this.snackBarService
          .openFromComponent<SnackBarComponent, NotificationData>(
            SnackBarComponent,
            notificationConfig({
              type: 'error',
              message: `${this.dialogData.mode} department failed`
            })
        );
      },
      complete: () => {
        this.snackBarService
          .openFromComponent<SnackBarComponent, NotificationData>(
            SnackBarComponent,
            notificationConfig({
              type: 'success',
              message: 'department saved successfully'
            })
        );
      }
    });
  }
}



