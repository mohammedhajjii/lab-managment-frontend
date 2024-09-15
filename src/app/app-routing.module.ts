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
import {departmentsResolver} from "./resolvers/departmentsResolver";
import {AllDepartmentsComponent} from "./ui/departments/all-departments/all-departments.component";
import {EquipmentsComponent} from "./ui/equipments/equipments/equipments.component";
import {allEquipmentCategoriesResolver, allEquipmentResolver, equipmentResolver} from "./resolvers/equipment.resolver";
import {CategoriesComponent} from "./ui/equipments/categories/categories/categories.component";
import {EquipmentDetailsComponent} from "./ui/equipments/equipment-details/equipment-details.component";



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
      departments: departmentsResolver,
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
          departments: departmentsResolver,
          professors: emptyUserListResolver,
          students: emptyUserListResolver
        }
      },
      {
        path: 'professors/:pid',
        component: UserRepresentationComponent,
        canDeactivate: [leaveGuard],
        resolve: {
          managedUser: parametricUserResolver('pid'),
          profile: profileResolver,
          delegatePredicate: defaultDelegatePredicateResolver,
          departments: departmentsResolver,
          professors: emptyUserListResolver,
          students: emptyUserListResolver
        }
      },
      {
        path: 'students',
        component: AllUsersComponent,
        resolve: {
          users: allStudentsResolver,
          profile: profileResolver,
          departments: departmentsResolver,
          professors: allProfessorsResolver,
          students: emptyUserListResolver
        }
      },
      {
        path: 'students/:sid',
        component: UserRepresentationComponent,
        canDeactivate: [leaveGuard],
        resolve: {
          managedUser: parametricUserResolver('sid'),
          profile: profileResolver,
          delegatePredicate: parametricDelegatePredicateResolver('sid'),
          departments: departmentsResolver,
          professors: allProfessorsResolver,
          students: emptyUserListResolver
        }
      },
      {
        path: 'guests',
        component: AllUsersComponent,
        resolve: {
          users: allGuestResolver,
          profile: profileResolver,
          departments: departmentsResolver,
          professors: allProfessorsResolver,
          students: allStudentsResolver
        }
      },
      {
        path: 'guests/:gid',
        component: UserRepresentationComponent,
        canDeactivate: [leaveGuard],
        resolve: {
          managedUser: parametricUserResolver('gid'),
          profile: profileResolver,
          delegatePredicate: defaultDelegatePredicateResolver,
          departments: departmentsResolver,
          professors: allProfessorsResolver,
          students: allStudentsResolver
        }
      },
      {
        path: 'departments',
        component: AllDepartmentsComponent,
        resolve: {
          departments: departmentsResolver
        }
      },
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
          departments: departmentsResolver,
          students: emptyUserListResolver
        }
      },
      {
        path: 'students/:sid',
        component: UserRepresentationComponent,
        canDeactivate: [leaveGuard],
        resolve: {
          managedUser: parametricUserResolver('sid'),
          profile: profileResolver,
          delegatePredicate: parametricDelegatePredicateResolver('sid'),
          departments: departmentsResolver,
          professors: allProfessorsResolver,
          students: emptyUserListResolver
        }
      },
      {
        path: 'guests',
        component: AllUsersComponent,
        resolve: {
          users: subGuestsResolver,
          profile: profileResolver,
          professors: allProfessorsResolver,
          departments: departmentsResolver,
          students: allStudentsResolver
        }
      },
      {
        path: 'guests/:gid',
        component: UserRepresentationComponent,
        canDeactivate: [leaveGuard],
        resolve: {
          managedUser: parametricUserResolver('gid'),
          profile: profileResolver,
          delegatePredicate: defaultDelegatePredicateResolver,
          departments: departmentsResolver,
          professors: allProfessorsResolver,
          students: allStudentsResolver
        }
      }
    ]
  },
  {
    path: 'equipments',
    canActivateChild: [childGuardGuard],
    data: {
      roles: ['ADMIN', 'PROFESSOR', 'DELEGATE']
    },
    children: [
      {
        path: '',
        component: EquipmentsComponent,
        resolve: {
          equipments: allEquipmentResolver,
          categories: allEquipmentCategoriesResolver
        }
      },
      {
        path: 'categories',
        component: CategoriesComponent,
        resolve: {
          categories: allEquipmentCategoriesResolver
        }
      },
      {
        path: ':id',
        component: EquipmentDetailsComponent,
        resolve: {
          equipment: equipmentResolver
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
