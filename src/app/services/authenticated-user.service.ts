import { Injectable } from '@angular/core';
import {KeycloakProfile} from "keycloak-js";
import {KeycloakService} from "keycloak-angular";
import {from} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthenticatedUserService {


   constructor(private keycloak: KeycloakService) {}


   loadAuthenticatedUserProfile(){
    return  from(this.keycloak.loadUserProfile(true));
  }

  async logout(){
    await this.keycloak.logout(window.location.origin);
  }
}
