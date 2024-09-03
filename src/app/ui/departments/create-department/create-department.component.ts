import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, Validators} from "@angular/forms";
import {departmentNameExistsValidator} from "../../../validators/department.async.validators";
import {DepartmentService} from "../../../services/department.service";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {DepartmentCreationStatus, DepartmentPopupData} from "../../../utils/popup.utils";
import {iif} from "rxjs";
import {departmentResolver} from "../../../resolvers/department.resolver";

@Component({
  selector: 'app-create-department',
  templateUrl: './create-department.component.html',
  styleUrl: './create-department.component.css'
})
export class CreateDepartmentComponent implements OnInit{

  protected readonly DepartmentCreationStatus = DepartmentCreationStatus;
  departmentName!: FormControl<string>;

  constructor(private departmentService: DepartmentService,
              @Inject(MAT_DIALOG_DATA) private dialogData: DepartmentPopupData) {
  }

  ngOnInit(): void {
    this.departmentName = new FormControl(this.dialogData.deptName,
      {
      validators: Validators.required,
      asyncValidators: departmentNameExistsValidator(this.departmentService)
    });
  }

  canBeActivated(): boolean {
    return  this.departmentName.valid && this.departmentName.dirty;
  }

  done(): void{
    iif(
      () => this.dialogData.mode === 'create',
      this.departmentService.createDepartment(this.departmentName.value),
      this.departmentService.updateDepartment(this.dialogData.deptId, this.departmentName.value)
    ).subscribe({
      error: err => {
        console.log('error: ' + err);
      },
      complete: () => {
        console.log('success')
      }
    });
  }
}



