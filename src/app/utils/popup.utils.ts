import {Profile, UserDetails} from "../models/user.model";
import {MatDialogConfig, MatDialogRef} from "@angular/material/dialog";
import {MatSnackBarConfig} from "@angular/material/snack-bar";
import {Department} from "../models/department.model";
import {Category, Equipment} from "../models/equipment.model";
import {ConfirmDialog} from "primeng/confirmdialog";


/*** -------------------------------- Config Generic type ------------------------**/

export type AppDialogConfig<T> = (data: T) => MatDialogConfig<T>;
export type AppSnackBarConfig<T> = (data: T) => MatSnackBarConfig<T>;
/*** -------------------------------- Config Generic type ------------------------**/

export interface UserCreationDialogData {
  kind: Profile;
  isAdmin: boolean;
  userContext: UserDetails,
  departments?: Department[],
  professors?: UserDetails[],
  students?: UserDetails[]
}

export enum DialogClosingState{
  CLOSED = 'closed',
  SUBMITTED = 'submitted'
}


export const userCreationDialogConfig: AppDialogConfig<UserCreationDialogData> =
    data => {
      return {
        autoFocus: true,
        disableClose: true,
        width: '80%',
        data: data
      }
}

/*----------------- popup utils for confirm dialog ------------------------------*/


export interface ConfirmDialogData{
  title: string;
  message: string;
}

export const confirmDialogConfig: AppDialogConfig<ConfirmDialogData> =
    data => {
      return  {
        autoFocus: true,
        disableClose: true,
        minWidth: '35%',
        data: data
      };
}


/*----------------- popup utils for snackbar for notification ------------------------------*/


export  interface NotificationData{
  message: string;
  type: 'success' | 'error'
}


export const notificationConfig: AppSnackBarConfig<NotificationData> = data => {
  return {
    duration: 5000,
    verticalPosition: 'top',
    horizontalPosition: 'end',
    panelClass: ['failure'],
    data: data
  }
}


/**----------------------------------- create or edit department popup ------------------------------**/

export interface DepartmentPopupData{
  mode: 'create' | 'update';
  deptId?: string;
  deptName?: string;
}

export enum DepartmentCreationStatus{
  DONE, CANCELED
}


export const departmentPopupConfig: AppDialogConfig<DepartmentPopupData> =
    data => {
  return {
    autoFocus: true,
    disableClose: true,
    width: '40%',
    data: data
  }
}

/* ------------------------------------------ Equipment dialogs -----------------------------*/

export interface EquipmentPopupData {
  categories: Category[];
}


export interface CategoryPopupData {
  mode: 'create' | 'update';
  id?: number;
  name?: string;
}

export const equipmentPopupConfig: AppDialogConfig<EquipmentPopupData> =
    data => {
      return {
        autoFocus: true,
        disableClose: true,
        width: '60%',
        data: data
      }
}


export const categoryPopupConfig: AppDialogConfig<CategoryPopupData> =
  data => {
    return {
      disableClose: true,
      autoFocus: true,
      width: '40%',
      data: data
    }
}


export interface QrCodePopupData{
  name: string;
  qrcode: string
}

export const qrcodePopupConfig: AppDialogConfig<QrCodePopupData> =
  qrcode => {
    return {
      disableClose: true,
      autoFocus: true,
      width: '40%',
      data: qrcode
    }
}


/**------------------------------------------------------------------**/
export interface EquipmentImageData{
  equipmentId: string;
}

export const equipmentImagePopupConfig: AppDialogConfig<EquipmentImageData> =
    data => {
      return {
        disableClose: true,
        autoFocus: true,
        width: '40%',
        data: data
      }

}

/**--------------------------------------------------------------**/

export interface UpdateEquipmentData {
  equipment: Equipment;
  categories: Category[];
}

export const updateEquipmentDialogConfig : AppDialogConfig<UpdateEquipmentData> =
  data => {
    return {
      disableClose: true,
      autoFocus: true,
      width: '50%',
      data: data
    };

  }

/**------------------------- Reservation popup -------------------------------------**/

export interface EquipmentReservationPopupData{

}

export const equipmentReservationDialogConfigFn : AppDialogConfig<EquipmentReservationPopupData> =
  data => {
    return {
      disableClose: true,
      autoFocus: true,
      width: '50%',
      data: data
    };
  }
