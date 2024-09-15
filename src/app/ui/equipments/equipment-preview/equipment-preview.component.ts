import {Component, Input, OnInit, Output} from '@angular/core';
import {Equipment} from "../../../models/equipment.model";
import {of, Subject, switchMap} from "rxjs";
import {EquipmentService} from "../../../services/equipment.service";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ConfirmComponent} from "../../popup/confirm/confirm.component";
import {confirmDialogConfig, ConfirmDialogData, notificationConfig, NotificationData} from "../../../utils/popup.utils";
import {OnAction} from "../../../utils/actions.utils";
import {SnackBarComponent} from "../../popup/snack-bar/snack-bar.component";

@Component({
  selector: 'app-equipment-preview',
  templateUrl: './equipment-preview.component.html',
  styleUrl: './equipment-preview.component.css'
})
export class EquipmentPreviewComponent implements OnInit{

  @Input() equipment!: Equipment;
  @Output() onDeleteEquipment: Subject<void> = new Subject();

  constructor(private equipmentService: EquipmentService,
              private dialogService: MatDialog,
              private snackBarService: MatSnackBar) {
  }

  ngOnInit(): void {

  }

  deleteEquipment() {

    const confirmDialogRef = this.dialogService
      .open<ConfirmComponent, ConfirmDialogData, boolean>(
        ConfirmComponent,
        confirmDialogConfig({
          title: 'delete equipment?',
          message: 'all related reservations will be deleted'
        })
      );

    confirmDialogRef.afterClosed()
      .pipe(
        switchMap(response => {
          if (response)
            return this.equipmentService.delete(this.equipment.id);
          return of(OnAction.CANCELLED)
        })
      ).subscribe({
      next: onAction => {
        if (onAction === OnAction.DONE){
          this.snackBarService
            .openFromComponent<SnackBarComponent, NotificationData>(
              SnackBarComponent,
              notificationConfig({
                type: 'success',
                message: 'equipment deleted successfully'
              })
            );
          this.onDeleteEquipment.next();
        }
        if (onAction === OnAction.ERROR){
          this.snackBarService
            .openFromComponent<SnackBarComponent, NotificationData>(
              SnackBarComponent,
              notificationConfig({
                type: 'error',
                message: 'delete equipment was failed'
              })
            );
        }
      }
    });

  }
}
