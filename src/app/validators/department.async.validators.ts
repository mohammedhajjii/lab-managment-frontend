import {DepartmentService} from "../services/department.service";
import {AsyncValidatorFn} from "@angular/forms";
import {iif, map, of, switchAll, switchMap, timer} from "rxjs";


export type DepartmentAsyncValidator = (departmentService: DepartmentService, exclude?: string) => AsyncValidatorFn;

export const departmentNameExistsValidator: DepartmentAsyncValidator =
  (departmentService, exclude) => {

  return control => {
    return timer(100).pipe(
      switchMap(() => departmentService.existsByName(control.value, exclude)),
      map(exists => exists ? {department: true}: null)
    )
  }
}
