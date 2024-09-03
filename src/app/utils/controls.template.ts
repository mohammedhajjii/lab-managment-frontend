import {FormControl, FormGroup} from "@angular/forms";
import {UserDetails} from "../models/user.model";
import {Department} from "../models/department.model";

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



export type PropertyMapper<T> = (element: T) => T[keyof T];


export class PropertyMappers{

  static userLabelMapper: PropertyMapper<UserDetails> =
      element => element.firstName + ' ' + element.lastName;

  static userValueMapper: PropertyMapper<UserDetails> =
    element => element.id;

  static departmentLabelMapper: PropertyMapper<Department> =
    element => element.name;

  static departmentValueMapper: PropertyMapper<Department> =
    element => element.id;
}
