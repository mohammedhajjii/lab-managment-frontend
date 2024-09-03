import {Component, OnInit} from '@angular/core';
import {Event, NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router} from "@angular/router";
import {Profile} from "../../models/user.model";
import {NavItemDetails} from "./nav-item/nav-item.component";
import {AuthenticatedUserService} from "../../services/authenticated-user.service";

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrl: './template.component.css'
})
export class TemplateComponent implements OnInit{

  displayLoadingIndicator: boolean = false;
  displayAccountPopup: boolean = false;

   navigationItems: NavItemDetails[] = [
    {
      itemLabel: 'Home',
      itemIcon: 'home',
      forRoute: ['/home'],
      onlyFor: ['BASIC_USER']
    },
     {
       itemLabel: 'Professors',
       itemIcon: 'school',
       forRoute: ['/admin/professors'],
       qParams: {profile: Profile.PROFESSOR, isAdmin: true},
       onlyFor: ['ADMIN']
     },
     {
       itemLabel: 'Students',
       itemIcon: 'emoji_people',
       forRoute: ['/admin/students'],
       qParams: {profile: Profile.PHD_STUDENT, isAdmin: true},
       onlyFor: ['ADMIN']
     },
     {
       itemLabel: 'Guests',
       itemIcon: 'person_add_alt_1',
       forRoute: ['/admin/guests'],
       qParams: {profile: Profile.GUEST, isAdmin: true},
       onlyFor: ['ADMIN']
     },
     {
       itemLabel: 'Department',
       itemIcon: 'business',
       forRoute: ['/admin/departments'],
       onlyFor: ['ADMIN']
     }
  ];


  constructor(private router: Router,
              private userContext: AuthenticatedUserService) {
  }


  ngOnInit() {

    this.userContext.loadAuthenticatedUserProfile()
      .subscribe({
        next: userContext =>{

          this.navigationItems.push({
            itemLabel: 'Students',
            itemIcon: 'emoji_people',
            forRoute: ['/professor', userContext.id, 'students'],
            qParams: {profile: Profile.PHD_STUDENT},
            onlyFor: ['PROFESSOR']
          });
          this.navigationItems.push({
            itemLabel: 'Guests',
            itemIcon: 'person_add_alt_1',
            forRoute: ['/professor', userContext.id, 'guests'],
            qParams: {profile: Profile.GUEST},
            onlyFor: ['PROFESSOR']
          });
        }
      });



    this.router.events.subscribe({
      next: (event: Event) => {
        if (event instanceof NavigationStart){
          this.displayLoadingIndicator = true;
        }

        if (event instanceof NavigationEnd ||
          event instanceof NavigationCancel ||
          event instanceof NavigationError){
          this.displayLoadingIndicator = false;
        }
      }
    })

  }


  hideAccountPopup(): void{
    this.displayAccountPopup = false;
  }

  toggleAccountPopup(): void{
    this.displayAccountPopup = !this.displayAccountPopup;
  }

}
