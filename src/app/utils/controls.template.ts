import {FormControl, FormGroup} from "@angular/forms";
import {UserDetails} from "../models/user.model";
import {Department} from "../models/department.model";
import {Category, EquipmentStatus} from "../models/equipment.model";
import {EquipmentStatusForFilter} from "./filters.utils";

export type FormGroupTemplate<T> = {[K in keyof T]: FormControl};
export type FormGroupData<T extends FormGroupTemplate<T>> = {[K in keyof T]: T[K]['value']}


export interface GeneralFormGroupTemplate {
  email: FormControl<string>;
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  enabled?: FormControl<boolean>;
}


export interface DepartmentDetailsFromGroupTemplate{
  department?: FormControl<string>;
  studentCode?: FormControl<string>;
  subject?: FormControl<string>;
  supervisor?: FormControl<string>;
  secondSupervisor?: FormControl<string>;
  description?: FormControl<string>;
}

export interface CredentialsFromGroupTemplate{
  username: FormControl<string>;
  password: FormControl<string>;
}

export type GeneralFormGroupData = FormGroupData<GeneralFormGroupTemplate>;
export type DepartmentDetailsFormGroupData = FormGroupData<DepartmentDetailsFromGroupTemplate>;
export type CredentialsFormGroupData = FormGroupData<CredentialsFromGroupTemplate>;


export const getControl: (formGroup: FormGroup, name: string) => FormControl =
  (formGroup, name) => {
  return formGroup.get(name) as FormControl;
}



export type Mapper<T, R = T[keyof T]> = (element: T) => R;


export class Mappers {

  static userLabelMapper: Mapper<UserDetails> =
      element => element.firstName + ' ' + element.lastName;

  static userValueMapper: Mapper<UserDetails, string> =
    element => element.id;

  static departmentLabelMapper: Mapper<Department> =
    element => element.name;

  static departmentValueMapper: Mapper<Department, string> =
    element => element.id;

  static equipmentCategoryValueMapper: Mapper<Category, number> =
    element => element.id;

  static equipmentCategoryLabelMapper: Mapper<Category, string> =
    element => element.name;

  static equipmentStatusMapper: Mapper<EquipmentStatusForFilter, EquipmentStatus> =
    element => element as unknown as EquipmentStatus;

}

//----------------------------------------


export interface EquipmentFormGroup{
  name: FormControl<string>;
  image: FormControl<Blob>;
  restricted: FormControl<boolean>;
  categoryId: FormControl<number>;
}


export interface UpdateEquipmentFormGroup {
  name: FormControl<string>;
  status: FormControl<EquipmentStatus>;
  restricted: FormControl<boolean>;
  categoryId: FormControl<number>;
}

export interface EquipmentReservationFormGroup {
  date: FormControl<Date>;
  startTime: FormControl<string>;
  endTime: FormControl<string>;
  description: FormControl<string>;
}
