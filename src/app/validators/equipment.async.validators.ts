import {EquipmentService} from "../services/equipment.service";
import {AsyncValidatorFn} from "@angular/forms";
import {catchError, map, of, switchMap, timer} from "rxjs";


export type EquipmentAsyncValidator = (service: EquipmentService, exclude?: string) => AsyncValidatorFn;
export type CategoryAsyncValidator = (service: EquipmentService, exclude?: number) => AsyncValidatorFn;


export const equipmentAsyncValidator: EquipmentAsyncValidator = (service, exclude) => {
  return control => {
    return timer(300).pipe(
      switchMap(() => service.exists(control.value, exclude)),
      map(response => response ? {equipment: true}: null),
      catchError(() => of({equipment: true}))
    );
  }
}


export const categoryNameAsyncValidator: CategoryAsyncValidator = (service, exclude) => {
  return control => {
    return timer(300).pipe(
      switchMap(() => service.existsCategory(control.value, exclude)),
      map(response => response ? {category: true}: null),
      catchError(() => of({category: true}))
    );
  }
}
