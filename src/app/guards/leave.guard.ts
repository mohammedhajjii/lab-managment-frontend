import {CanActivateFn, CanDeactivateFn} from '@angular/router';
import {Observable} from "rxjs";


export interface CanExit {
  canExit: () => Observable<boolean> | Promise<boolean> | boolean ;
}


export const leaveGuard: CanDeactivateFn<CanExit> =
  (component, currentRoute) => {
  return component.canExit();
}
