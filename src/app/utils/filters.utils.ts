import {Mapper} from "./controls.template";
import {FormControl, FormGroup} from "@angular/forms";
import {Department} from "../models/department.model";
import {UserDetails} from "../models/user.model";
import {Category, Equipment, EquipmentStatus} from "../models/equipment.model";

//types:
export type Predicate<T = any> = (item: T) => boolean;
export type PredicateFn<V, D> = (value: V) => Predicate<D>;
export type FilterGroupMap<T> = {[K in keyof T]: FilterControl};
export type FilterGroupData<T extends FilterGroupMap<T>> =
  {[K in keyof T]: T[K]['all']};

export type FilterFormGroupMap<T extends FilterGroupMap<T>> =
  {[K in keyof T]: T[K]['formControl']};

export type SubscriberMap<T> = {[K in keyof T]: Exclude<keyof T, K>};

export type DataSourceMap<T extends FilterGroupMap<T>> =
  {[K in keyof T]: T[K]['origin']};

//classes:

export class Predicates{
  static all: Predicate = () => true;
}

export class FilterControl<S = any, D = any, V = S[keyof S], E = S>{
  private _origin: S[];
  private _displayedData: S[];
  private readonly _valueMapper: Mapper<S,  V>;
  private readonly _labelMapper: Mapper<S, any>;
  private readonly _all: V;
  private readonly _none?: V;
  private readonly _defaultValue?: V;
  private readonly _visible: boolean;
  private readonly _internalPredicateFn?: PredicateFn<V, D>;
  private readonly _externalPredicateFn?: PredicateFn<V, E>;
  private readonly _formControl: FormControl<V>;
  private readonly _label: string;
  private readonly _placeholder: string;

  constructor(filterControl: {
    label: string,
    placeholder: string,
    origin: S[],
    valueMapper: Mapper<S, V>,
    labelMapper: Mapper<S, any>,
    all: V,
    none?: V,
    defaultValue?: V,
    visible?: boolean,
    internal?: PredicateFn<V, D>
    external: PredicateFn<V, E>
  }) {
    this._label = filterControl.label;
    this._placeholder = filterControl.placeholder;
    this._origin = filterControl.origin;
    this._displayedData = filterControl.origin;
    this._valueMapper = filterControl.valueMapper;
    this._labelMapper = filterControl.labelMapper;
    this._all = filterControl.all;
    this._visible = filterControl.visible ?? true;
    this._formControl = new FormControl<V>(filterControl.defaultValue || filterControl.all);
    this._externalPredicateFn = filterControl.external;
    if(filterControl.internal)
      this._internalPredicateFn = filterControl.internal;

    if (filterControl.none)
      this._none = filterControl.none;

    if(filterControl.defaultValue)
      this._defaultValue = filterControl.defaultValue;
  }

  get origin(): S[] {
    return this._origin;
  }
  set origin(value: S[]) {
    this._origin = value;
  }
  get displayedData(): S[] {
    return this._displayedData;
  }
  set displayedData(value: S[]) {
    this._displayedData = value;
  }
  get valueMapper(): Mapper<S, V> {
    return this._valueMapper;
  }
  get labelMapper(): Mapper<S, any> {
    return this._labelMapper;
  }
  get all(): V {
    return this._all;
  }
  get none(): V {
    return this._none;
  }
  get formControl(): FormControl<V> {
    return this._formControl;
  }
  get label(): string {
    return this._label;
  }
  get placeholder(): string {
    return this._placeholder;
  }
  get visible(): boolean {
    return this._visible;
  }

  applyInternalPredicateFn(value: V): Predicate<D>{
    if (value === this._all)
      return Predicates.all;
    return this._internalPredicateFn(value);
  }

  applyExternalPredicateFn(value: V): Predicate<E>{
    if (value === this._all)
      return Predicates.all;
    return this._externalPredicateFn(value);
  }

  subscribe(subscriber: FilterControl<D, any, any>): void{
    this._formControl.valueChanges.subscribe({
      next: value => {
        subscriber.displayedData = subscriber.origin
          .filter(this.applyInternalPredicateFn(value));
        subscriber.formControl.setValue(subscriber.all);
      }
    });
    if(this._defaultValue)
      this._formControl.setValue(this._defaultValue);
  }
}

export class FilterGroup<T extends FilterGroupMap<T>>{

  private readonly _formGroup: FormGroup<FilterFormGroupMap<T>>;

  constructor(private _filterControls: T) {
    const tmp: FormGroup = new FormGroup({});
    Object.keys(_filterControls)
      .forEach(key => {
        tmp.addControl(key, _filterControls[key as keyof T].formControl);
      });
    this._formGroup = tmp;
  }


  get formGroup(): FormGroup<FilterFormGroupMap<T>> {
    return this._formGroup;
  }

  get filterControls(): FilterControl[] {
    return Object.values<FilterControl>(this._filterControls);
  }

  getFilterControl<K extends keyof T>(key: K): T[K]{
    return this._filterControls[key];
  }

  addFilterControl<K extends keyof T>(key: K, filterControl: T[K]): void{
    this._filterControls[key] = filterControl;
    (this._formGroup as FormGroup).addControl(key as string, filterControl.formControl);
  }

  contains(key: string): boolean{
    return this._filterControls[key] !== undefined;
  }

  getRawValues(){
    return this._formGroup.getRawValue();
  }
}

/** -------------------------------- Filters examples ------------------------------- **/

//users filter by departments professors, and students: ---------------------------
export interface UserFilter {
  department?: FilterControl<Department, UserDetails, string, UserDetails>;
  professor?: FilterControl<UserDetails, UserDetails, string>;
  student?: FilterControl<UserDetails, any, string>;
}

export const usersFilterSubscribersMap: SubscriberMap<UserFilter> = {
  department: "professor",
  professor: "student"
}

//-------------------------------equipments filters ------------------------:

export enum AllEquipmentStatus {
  ALL = 'ALL'
}

export type EquipmentStatusForFilter = EquipmentStatus | AllEquipmentStatus;

export const allEquipmentStatusValues: EquipmentStatusForFilter[] = [
  EquipmentStatus.AVAILABLE,
  EquipmentStatus.OUT_OF_SERVICE,
  EquipmentStatus.DECOMMISSIONED
]

export interface EquipmentFilter {
  category?: FilterControl<Category, any, number, Equipment>;
  status?: FilterControl<EquipmentStatusForFilter, any, EquipmentStatusForFilter, Equipment>
}

