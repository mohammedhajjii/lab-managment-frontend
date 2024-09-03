import {Profile, UserDetails} from "../models/user.model";
import {Observable} from "rxjs";
import {MatDialogConfig} from "@angular/material/dialog";
import {MatSnackBarConfig} from "@angular/material/snack-bar";
import {KeycloakProfile} from "keycloak-js";
import {Department} from "../models/department.model";

export interface UserCreationDialogData {
  kind: Profile;
  isAdmin: boolean;
  userContext: KeycloakProfile,
  departments?: Department[],
  professors?: UserDetails[],
  students?: UserDetails[],
  secondSupervisorList?: Observable<UserDetails[]>
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
  operation: string;
  success: boolean;
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
    minWidth: '35%',
    data: data
  }
}
