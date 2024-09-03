import {AsyncValidatorFn,} from "@angular/forms";
import {UserService} from "../services/user.service";
import {catchError, map, of, switchMap, timer} from "rxjs";



export type AsyncUserValidator = (userService: UserService,except?: string) => AsyncValidatorFn;

export const asyncEmailValidator: AsyncUserValidator = ( userService, except) => {
  return control => {
    return timer(100).pipe(
      switchMap(() => userService.countWithEmail(control.value, except)),
      map(i => i === 0 ? null : {emailInUse: true}),
      catchError(() => of({emailInUse: true}))
    );
  }
}


export const asyncUsernameValidator: AsyncUserValidator = ( userService, except) => {
  return control => {
    return timer(100).pipe(
      switchMap(() => userService.countWithUsername(control.value, except)),
      map(i => i === 0 ? null : {username: true}),
      catchError(() => of({username: true}))
    );
  }
}


export const asyncStudentCodeValidator: AsyncUserValidator = ( userService, except) => {
  return control => {
      return timer(100).pipe(
        switchMap(() => userService.countWithStudentCode(control.value, except)),
        map(occ => occ === 0 ? null : {studentCode: true}),
        catchError(() => of({studentCode: true}))
      );
  }
}
