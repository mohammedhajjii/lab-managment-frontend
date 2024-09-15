import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, Validators} from "@angular/forms";
import {EquipmentService} from "../../../../services/equipment.service";
import {categoryNameAsyncValidator} from "../../../../validators/equipment.async.validators";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {CategoryPopupData, notificationConfig, NotificationData} from "../../../../utils/popup.utils";
import {iif} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";
import {SnackBarComponent} from "../../../popup/snack-bar/snack-bar.component";

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent implements OnInit{


  categoryNameControl!: FormControl<string>;

  constructor(private equipmentService: EquipmentService,
              private snackBarService: MatSnackBar,
              @Inject(MAT_DIALOG_DATA) public data: CategoryPopupData) {
  }

  ngOnInit(): void {
    const id: number = this.data.id;
    const name: string = this.data.name;

    console.log(`{id: ${id}, name: ${name}`);

    this.categoryNameControl = new FormControl<string>(name || null, {
      validators: Validators.required,
      asyncValidators: categoryNameAsyncValidator(this.equipmentService, id || undefined)
    });

  }


  save(): void {

    iif(
      () => this.data.mode === 'create',
      this.equipmentService.createCategory(this.categoryNameControl.value),
      this.equipmentService.renameCategory(this.data.id, this.categoryNameControl.value)
    ).subscribe({
      error: err => {

        this.snackBarService
          .openFromComponent<SnackBarComponent, NotificationData>(
            SnackBarComponent,
            notificationConfig({
              type: 'error',
              message: err.message
            })
          );
      },
      complete: () => {

        this.snackBarService
          .openFromComponent<SnackBarComponent, NotificationData>(
            SnackBarComponent,
            notificationConfig({
              type: 'success',
              message: 'category saved successfully'
            })
          );
      }
    })


  }
}
