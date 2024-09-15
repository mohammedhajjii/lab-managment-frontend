import {AsyncValidatorFn, ValidatorFn} from "@angular/forms";
import {Supervisor} from "../models/user.model";
import {Mapper} from "./controls.template";


export interface FieldDescriptor<T, R>{
  label: string;
  value: R;
  readOnly?: boolean;
  type?: 'input' | 'select';
  inputType?: 'text' | 'email' | 'tel'
  placeholder?: string;
  validators?: ValidatorFn | ValidatorFn[];
  asyncValidators?: AsyncValidatorFn | AsyncValidatorFn[];
  errors?: Record<string, string>;
  datasource?: T[];
  valueMapper?: Mapper<T>;
  labelMapper?: Mapper<T>;
  controlWidth?: string;
}

export class Field<T = any, R extends (T | T[keyof T]) = T> {
  private readonly _label: string;
  private _value: R;
  private _readOnly: boolean;
  private readonly _type: 'input' | 'select';
  private readonly _placeholderText: string;
  private readonly _inputType?: 'text' | 'email' | 'tel';
  private readonly _validators?: ValidatorFn | ValidatorFn[];
  private readonly _asyncValidators?: AsyncValidatorFn | AsyncValidatorFn[];
  private readonly _errors?: Record<string, string>;
  private readonly _datasource?: T[];
  private readonly _valueMapper?: Mapper<T>;
  private readonly _labelMapper?: Mapper<T>;
  private readonly _controlWidth?: string;

  constructor(field: FieldDescriptor<T, R>) {
    this._controlWidth = field.controlWidth || '100%';
    this._label = field.label;
    this._value = field.value;
    this._readOnly = field.readOnly || false;
    this._type = field.type || 'input';
    this._inputType = field.inputType || 'text';
    this._validators = field.validators || [];
    this._asyncValidators = field.asyncValidators || [];
    this._errors = field.errors || {};
    this._datasource = field.datasource || [];
    this._valueMapper = field.valueMapper;
    this._labelMapper = field.labelMapper;
  }


  get label(): string {
    return this._label;
  }

  get value(): R {
    return this._value;
  }


  set value(value: R) {
    this._value = value;
  }

  get readOnly(): boolean {
    return this._readOnly;
  }


  set readOnly(value: boolean) {
    this._readOnly = value;
  }

  get type(): "input" | "select" {
    return this._type;
  }

  get placeholderText(): string {
    return this._placeholderText;
  }


  get inputType(): "text" | "email" | "tel" {
    return this._inputType;
  }

  get validators(): ValidatorFn | ValidatorFn[] {
    return this._validators;
  }

  get asyncValidators(): AsyncValidatorFn | AsyncValidatorFn[] {
    return this._asyncValidators;
  }

  get errors(): Record<string, string> {
    return this._errors;
  }

  get datasource(): T[] {
    return this._datasource;
  }

  get valueMapper(): Mapper<T> {
    return this._valueMapper;
  }

  get labelMapper(): Mapper<T> {
    return this._labelMapper;
  }


  get controlWidth(): string {
    return this._controlWidth;
  }
}

export type FieldSetTemplate<T> = {[K in keyof T]: Field}
export type FieldSetValues<T extends FieldSetTemplate<T>> = {[K in keyof T]: T[K]['value']}

export class FieldSet<T extends FieldSetTemplate<T>>{


  constructor(private _fields: T,
              private _touched: boolean = false) {
  }

  get fields(): T[keyof T][]{
    return Object.keys(this._fields)
      .map(key => this.getField(key as keyof T));
  }

  get touched(): boolean{
    return this._touched;
  }

  set touched(touched: boolean){
    this._touched = touched;
  }

  isStatic(): boolean {
    return this.fields.every(field => field.readOnly)
  }

  add<K extends keyof T>(fieldName: K, field: T[K]){
    this._fields[fieldName] = field;
  }

  getField<K extends keyof T>(fieldName: K): T[K]{
    return this._fields?.[fieldName];
  }

  getRawValues(): FieldSetValues<T>{
    const values: FieldSetValues<T> = {} as FieldSetValues<T>;

    Object.keys(this._fields)
      .map(key => key as keyof T)
      .forEach(key => values[key] = this._fields[key].value);

    return values;
  }

  reset(values: FieldSetValues<T>): void{
    Object.keys(values)
      .map(key => key as keyof T)
      .forEach(key => {
        this._fields[key].value = values[key];
      });
    this._touched = false;
  }

}


export interface CreationFieldSetTemplate {
  id?: Field<string>;
  createdAt?: Field<string>;
}


export interface BasicFieldSetTemplate {
  firstname?: Field<string>;
  lastname?: Field<string>;
  email?: Field<string>;
  username?: Field<string>;
}


export interface AcademicFieldSetTemplate {
  department?: Field<string>;
  managerName?: Field<Supervisor, string>;
  managerEmail?: Field<Supervisor, string>;
  studentCode?: Field<string>;
  subject?: Field<string>;
  coManagerName?: Field<Supervisor, string>;
  coManagerEmail?: Field<Supervisor, string>;
  description?: Field<string>;
}

export interface ProfileOverview{
  id: Field<string>;
  createdAt: Field<string>;
  username: Field<string>;
}
