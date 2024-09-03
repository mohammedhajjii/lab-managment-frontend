import {Component, Input, OnInit, Output} from '@angular/core';
import {KeycloakService} from "keycloak-angular";
import {AuthenticatedUserService} from "../../../services/authenticated-user.service";
import {Subject} from "rxjs";

@Component({
  selector: 'app-account-popup',
  templateUrl: './account-popup.component.html',
  styleUrl: './account-popup.component.css'
})
export class AccountPopupComponent implements OnInit{
  id!: string;
  email!: string;
  label!: string;
  firstname!: string;

  @Output() closeTrigger: Subject<void> = new Subject<void>();

  constructor(private authenticatedUserService: AuthenticatedUserService) {
  }

  async signOut(){
    await this.authenticatedUserService.logout();
  }

  ngOnInit(): void {
    this.authenticatedUserService.loadAuthenticatedUserProfile()
      .subscribe({
        next: authenticatedUser => {
          this.id = authenticatedUser.id;
          this.firstname = authenticatedUser.firstName;
          this.email = authenticatedUser.email;
          this.label = authenticatedUser?.firstName[0]
            .concat(authenticatedUser?.lastName[0])
            .toUpperCase();
        }
      })
  }

  raiseCloseEvent() {
    this.closeTrigger.next();
  }
}
