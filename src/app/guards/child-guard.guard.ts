import { CanActivateFn } from '@angular/router';
import {genericGuard} from "./generic.guard";

export const childGuardGuard: CanActivateFn =
  (route, state) => {
  return genericGuard(route, state);
};
