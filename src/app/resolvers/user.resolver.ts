import {ResolveFn} from "@angular/router";
import {Supervisor, UserDetails} from "../models/user.model";
import {UserService} from "../services/user.service";
import {inject} from "@angular/core";
import {catchError, from, map, of, switchMap} from "rxjs";
import {AuthenticatedUserService} from "../services/authenticated-user.service";

//used
export const profileResolver: ResolveFn<UserDetails> = () => {
  const authenticatedUserService: AuthenticatedUserService = inject<AuthenticatedUserService>(AuthenticatedUserService);
  return from(authenticatedUserService.loadAuthenticatedUserProfile());
}

export const emptyUserListResolver: ResolveFn<UserDetails[]> = () => {
  return of<UserDetails[]>([]);
}

//used
export const allProfessorsResolver: ResolveFn<UserDetails[]> = () => {
  const userService: UserService = inject<UserService>(UserService);
  return userService.getProfessors();
};

//used
export const allStudentsResolver: ResolveFn<UserDetails[]> = () => {
  const userService: UserService = inject<UserService>(UserService);
  return userService.getStudents();
};

//used
export const allGuestResolver: ResolveFn<UserDetails[]> = () => {
  const userService: UserService = inject<UserService>(UserService);
  return userService.getGuests();
};


//used
export const managerDetailsResolver: ResolveFn<Supervisor> = route => {
  const  userService: UserService = inject(UserService);

  return userService.getUserById(route.paramMap.get('id')).pipe(
     switchMap(user => {
       if (user.attributes.supervisor && user.attributes.supervisor !== 'none')
         return userService.getUserById(user.attributes.supervisor);
       throw new Error()
     }),
    map(manager => new Supervisor(manager)),
    catchError(() => of(Supervisor.widthDefault()))
  );
}

//used
export const coManagerDetailsResolver: ResolveFn<Supervisor> = route => {
  const  userService: UserService = inject(UserService);

  return userService.getUserById(route.paramMap.get('id')).pipe(
    switchMap(user => {
      if (user.attributes.secondSupervisor && user.attributes.secondSupervisor !== 'none')
        return userService.getUserById(user.attributes.secondSupervisor);
      throw new Error();
    }),
    map(manager => new Supervisor(manager)),
    catchError(() => of(Supervisor.widthDefault()))
  );
}



//used
export const subStudentsResolver: ResolveFn<UserDetails[]> = route => {
  const userService: UserService = inject<UserService>(UserService);
  return userService.getStudentsByProfessor(route.paramMap.get('pid'));
}


//used
export const subGuestsResolver: ResolveFn<UserDetails[]> = route => {
  const userService: UserService = inject<UserService>(UserService);
  return userService.getGuestsByProfessor(route.paramMap.get('pid'));
}

export type ParametricUserResolverFn = (id: string) => ResolveFn<UserDetails>;
//used
export const parametricUserResolver: ParametricUserResolverFn = id => {
  return route => {
    const userService: UserService = inject<UserService>(UserService);
    return userService.getUserById(route.paramMap.get(id));
  }
}

export type parametricPredicateFn = (id: string ) => ResolveFn<boolean>;
//used
export const parametricDelegatePredicateResolver: parametricPredicateFn = id => {
  return route => {
    const userService: UserService = inject<UserService>(UserService);
    return userService.isDelegated(route.paramMap.get(id));
  }
}

//used
export const defaultDelegatePredicateResolver: ResolveFn<boolean> = () => {
  return of(false);
}


