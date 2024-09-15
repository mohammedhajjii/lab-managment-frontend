import { Injectable } from '@angular/core';
import {KeycloakService} from "keycloak-angular";
import {from, map, Observable} from "rxjs";
import {UserDetails} from "../models/user.model";

@Injectable({
  providedIn: 'root'
})
export class AuthenticatedUserService {


   constructor(private keycloak: KeycloakService) {}


   loadAuthenticatedUserProfile(): Observable<UserDetails>{
    return  from(this.keycloak.loadUserProfile(true))
      .pipe(
        map(profile => new UserDetails(profile))
      );
  }

  async logout(){
    await this.keycloak.logout(window.location.origin);
  }
}
