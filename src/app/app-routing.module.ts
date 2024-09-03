import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./ui/home/home.component";
import {authGuard} from "./guards/auth.guard";
import {ProfileInfosComponent} from "./ui/profile-infos/profile-infos.component";
import {childGuardGuard} from "./guards/child-guard.guard";
import {UserRepresentationComponent} from "./ui/users/user-representation/user-representation.component";
import {
  coManagerDetailsResolver,
  defaultDelegatePredicateResolver,
  subGuestsResolver,
  managerDetailsResolver,
  parametricUserResolver,
  profileResolver,
  subStudentsResolver
  ,
  allProfessorsResolver,
  allStudentsResolver,
  allGuestResolver,
  parametricDelegatePredicateResolver,
  emptyUserListResolver
} from "./resolvers/user.resolver";
import {ErrorComponent} from "./ui/error/error.component";
import {AllUsersComponent} from "./ui/users/all-users/all-users.component";
import {leaveGuard} from "./guards/leave.guard";
import {departmentResolver} from "./resolvers/department.resolver";
import {of} from "rxjs";
import {AllDepartmentsComponent} from "./ui/departments/all-departments/all-departments.component";



const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [authGuard],
    data: {
      roles: ['BASIC_USER']
    }

  },
  {
    path: 'profile/:id',
    canActivate: [authGuard],
    canDeactivate: [leaveGuard],
    component: ProfileInfosComponent,
    data: {
      roles: ['BASIC_USER']
    },
    resolve: {
      authenticatedUserDetails: parametricUserResolver('id'),
      isDelegate: parametricDelegatePredicateResolver('id'),
      departments: departmentResolver,
      manager: managerDetailsResolver,
      coManager: coManagerDetailsResolver
    }
  },
  {
    path: 'admin',
    canActivateChild: [childGuardGuard],
    data: {
      roles: ['ADMIN']
    },
    children: [
      {
        path: 'professors',
        component: AllUsersComponent,
        resolve: {
          users: allProfessorsResolver,
          profile: profileResolver,
          professors: emptyUserListResolver,
          departments: departmentResolver
        }
      },
      {
        path: 'professors/:pid',
        component: UserRepresentationComponent,
        canDeactivate: [leaveGuard],
        resolve: {
          managedUser: parametricUserResolver('pid'),
          profile: profileResolver,
          departments: departmentResolver,
          delegatePredicate: defaultDelegatePredicateResolver
        }
      },
      {
        path: 'students',
        component: AllUsersComponent,
        resolve: {
          users: allStudentsResolver,
          profile: profileResolver,
          professors: allProfessorsResolver,
          departments: departmentResolver
        }
      },
      {
        path: 'students/:sid',
        component: UserRepresentationComponent,
        canDeactivate: [leaveGuard],
        resolve: {
          managedUser: parametricUserResolver('sid'),
          profile: profileResolver,
          departments: departmentResolver,
          professors: allProfessorsResolver,
          delegatePredicate: parametricDelegatePredicateResolver('sid')
        }
      },
      {
        path: 'guests',
        component: AllUsersComponent,
        resolve: {
          users: allGuestResolver,
          profile: profileResolver,
          professors: allProfessorsResolver,
          departments: departmentResolver
        }
      },
      {
        path: 'guests/:gid',
        component: UserRepresentationComponent,
        canDeactivate: [leaveGuard],
        resolve: {
          managedUser: parametricUserResolver('gid'),
          profile: profileResolver,
          departments: departmentResolver,
          professors: allProfessorsResolver,
          delegatePredicate: defaultDelegatePredicateResolver
        }
      },
      {
        path: 'departments',
        component: AllDepartmentsComponent,
        resolve: {
          departments: departmentResolver
        }
      }
    ]
  },
  {
    path: 'professor/:pid',
    canActivateChild: [childGuardGuard],
    data: {
      roles: ['PROFESSOR']
    },
    children: [
      {
        path: 'students',
        component: AllUsersComponent,
        resolve: {
          users: subStudentsResolver,
          profile: profileResolver,
          professors: allProfessorsResolver,
          departments: departmentResolver
        }
      },
      {
        path: 'students/:sid',
        component: UserRepresentationComponent,
        canDeactivate: [leaveGuard],
        resolve: {
          managedUser: parametricUserResolver('sid'),
          profile: profileResolver,
          departments: departmentResolver,
          professors: allProfessorsResolver,
          delegatePredicate: parametricDelegatePredicateResolver('sid')
        }
      },
      {
        path: 'guests',
        component: AllUsersComponent,
        resolve: {
          users: subGuestsResolver,
          profile: profileResolver,
          professors: allProfessorsResolver,
          departments: departmentResolver
        }
      },
      {
        path: 'guests/:gid',
        component: UserRepresentationComponent,
        canDeactivate: [leaveGuard],
        resolve: {
          managedUser: parametricUserResolver('gid'),
          profile: profileResolver,
          departments: departmentResolver,
          professors: allProfessorsResolver,
          delegatePredicate: defaultDelegatePredicateResolver
        }
      }
    ]
  },
  {
    path: '**',
    component: ErrorComponent
  }


];

@NgModule({
  imports: [RouterModule.forRoot(routes,{
    scrollPositionRestoration: 'enabled',
    scrollOffset: [0, 100],
    anchorScrolling: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
