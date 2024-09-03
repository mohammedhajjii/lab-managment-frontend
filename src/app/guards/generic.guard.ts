import {ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs";
import {KeycloakService} from "keycloak-angular";
import {inject} from "@angular/core";


export type GenericGuard = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) =>
  Observable<boolean> | Promise<boolean> | boolean;


export const  genericGuard: GenericGuard = async (route, state) => {
  const keycloak: KeycloakService = inject(KeycloakService);

  // if the user isn't authenticated:
  if (!keycloak.isLoggedIn()){
    await keycloak.login({
      redirectUri: window.location.origin + state.url
    });
  }


  const requiredRoles: string[] = route.data['roles'];

  console.log('req roles:' + requiredRoles)

  const result: boolean = (requiredRoles.length == 0) ||
    (requiredRoles.some(role => keycloak.isUserInRole(role)));

  console.log('result: ' + result);

  return result;
}
