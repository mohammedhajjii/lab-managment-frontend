import {Directive, Input, TemplateRef, ViewContainerRef} from '@angular/core';
import {KeycloakService} from "keycloak-angular";

@Directive({
  selector: '[only]'
})
export class AuthDirective {

  constructor(private templateRef: TemplateRef<any>,
              private viewContainer: ViewContainerRef,
              private keycloak: KeycloakService) { }


  @Input() set only(authorizedRoles: string[]){
    if (authorizedRoles.some(role => this.keycloak.isUserInRole(role))){
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
    else {
      this.viewContainer.clear();
    }
  }

}
