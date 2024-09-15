import {Profile, UserDetails} from "../models/user.model";
import {MatDialogConfig, MatDialogRef} from "@angular/material/dialog";
import {MatSnackBarConfig} from "@angular/material/snack-bar";
import {Department} from "../models/department.model";
import {Category, Equipment} from "../models/equipment.model";

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


export const userCreationDialogConfig = function (data: UserCreationDialogData): MatDialogConfig<UserCreationDialogData>{
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

export const confirmDialogConfig = function (data: ConfirmDialogData): MatDialogConfig {
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


export const notificationConfig = function (data: NotificationData): MatSnackBarConfig<NotificationData>{
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

export type DepartmentPopupConfiguration = (data: DepartmentPopupData) => MatDialogConfig<DepartmentPopupData>;

export const departmentPopupConfig: DepartmentPopupConfiguration =
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

export type EquipmentPopupDialogConfiguration =
  (data: EquipmentPopupData) => MatDialogConfig<EquipmentPopupData>;

export type CategoryPopupDialogConfiguration =
  (data: CategoryPopupData) => MatDialogConfig<CategoryPopupData>;

export const equipmentPopupConfig: EquipmentPopupDialogConfiguration =
    data => {
      return {
        autoFocus: true,
        disableClose: true,
        width: '60%',
        data: data
      }
}


export const categoryPopupConfig: CategoryPopupDialogConfiguration =
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

export type QrCodePopupConfig =
  (qrcode: QrCodePopupData) => MatDialogConfig<QrCodePopupData>;

export const qrcodePopupConfig: QrCodePopupConfig =
  qrcode => {
    return {
      disableClose: true,
      autoFocus: true,
      width: '40%',
      data: qrcode
    }
}
