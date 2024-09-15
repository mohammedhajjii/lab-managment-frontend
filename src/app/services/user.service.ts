import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {
  concatMap,
  count,
  defaultIfEmpty,
  filter,
  map,
  merge,
  mergeAll,
  Observable,
  of,
  switchMap,
  take, tap,
  toArray
} from "rxjs";
import {Group, Profile, unsupervised, UserDetails} from "../models/user.model";
import {environment, UserGroups} from "../../environments/environment";
import {Augmented} from "../utils/transformers.utils";


@Injectable({
  providedIn: 'root'
})
export class UserService{

  private usersGroups: UserGroups = environment.keycloakGroups;
  private baseUrl: string = environment.keycloakAdminApi.baseUrl;
  private endpoints: Record<string, string> = environment.keycloakAdminApi.endpoints;

  constructor(private http: HttpClient) { }


  /**
   * this method to get a list of professors from professors group
   * @return Observable<UserDetails[]>
   */

  getProfessors(): Observable<UserDetails[]>{
    const url: string = `${this.baseUrl}${this.endpoints?.['groupsEndpoint']}/${this.usersGroups.professors}/members`
    return this.http.get<Augmented<UserDetails>[]>(url).pipe(
      // switchMap(users => from(users)),
      mergeAll(),
      map(augmentedUser => new UserDetails(augmentedUser)),
      toArray()
    );
  }

  /**
   * this method to get a list of students from students group
   * @return Observable<UserDetails[]>
   */

  getStudents(): Observable<UserDetails[]>{
    const url: string = `${this.baseUrl}${this.endpoints?.['groupsEndpoint']}/${this.usersGroups.phdStudents}/members`
    return this.http.get<Augmented<UserDetails>[]>(url).pipe(
      mergeAll(),
      map(augmentedUser => new UserDetails(augmentedUser)),
      toArray()
    );
  }

  /**
   * this method to get a list of guests from guests group
   * @return Observable<UserDetails[]>
   */

  getGuests():Observable<UserDetails[]>{
    const url: string = `${this.baseUrl}${this.endpoints?.['groupsEndpoint']}/${this.usersGroups.guests}/members`
    return this.http.get<Augmented<UserDetails>[]>(url).pipe(
      mergeAll(),
      map(augmentedUser => new UserDetails(augmentedUser)),
      toArray()
    );
  }

  getUsersByProfile(profile: Profile): Observable<UserDetails[]>{
    switch (profile){
      case Profile.PROFESSOR:
        return this.getProfessors();
      case Profile.PHD_STUDENT:
        return this.getStudents();
      case Profile.GUEST:
        return this.getGuests();
      default:
        return of([])
    }
  }

  /**
   * test? if i  add the user, the user.id will be updated ????
   * @param userDetails
   */

  create(userDetails: UserDetails) {
    const url: string = `${this.baseUrl}${this.endpoints?.['usersEndpoint']}`
    return this.http.post(url, userDetails);
  }

  /**
   * also test? if i  add the user, the user.id will be updated ????
   * @param userDetails
   */

  update(userDetails: UserDetails){
    const url: string = `${this.baseUrl}${this.endpoints?.['usersEndpoint']}/${userDetails.id}`
    return this.http.put(url, userDetails);
  }

  delete(id: string){
    const url: string = `${this.baseUrl}${this.endpoints?.['usersEndpoint']}/${id}`
    return this.http.delete(url);
  }

  safeDelete(id: string, kind: Profile = Profile.GUEST){
    return this.delete(id)
      .pipe(
        switchMap(() => {
          switch (kind){
            case Profile.PROFESSOR:
              return this.getStudentsAndGuestsByProfessor(id);
            case Profile.PHD_STUDENT:
              return this.getGuestByCoSupervisor(id);
            default:
              return of();
          }
        }),
        mergeAll(),
        concatMap(user => {
          if(kind === Profile.PROFESSOR)
            user.attributes.supervisor = 'none';
          if (kind === Profile.PHD_STUDENT)
            user.attributes.secondSupervisor = 'none'
          return this.update(user);
        })
      );
  }

  getUserById(id: string): Observable<UserDetails>{
    const url: string = `${this.baseUrl}${this.endpoints?.['usersEndpoint']}/${id}`
    return this.http.get<Augmented<UserDetails>>(url).pipe(
      map(augmentedUser => new UserDetails(augmentedUser))
    );
  }



  getAllUsers(): Observable<UserDetails[]>{
    const url: string = `${this.baseUrl}${this.endpoints?.['usersEndpoint']}`
    return this.http.get<Augmented<UserDetails>[]>(url).pipe(
      mergeAll(),
      map(augmentedUser => new UserDetails(augmentedUser)),
      toArray()
    );
  }




  getStudentsByProfessor(id: string): Observable<UserDetails[]> {
    return this.getStudents().pipe(
      mergeAll(),
      filter(student => student.attributes.supervisor === id),
      toArray()
    );
  }

  getGuestsByProfessor(id: string): Observable<UserDetails[]>{
    return this.getGuests().pipe(
      mergeAll(),
      filter(guest => guest.attributes.supervisor === id),
      toArray()
    );
  }



  delegate(id: string) {
    const url: string = `${this.baseUrl}${this.endpoints?.['usersEndpoint']}/${id}/groups/${this.usersGroups.delegates}`;
    return this.http.put(url, {});
  }

  unDelegate(id: string){
    const url: string = `${this.baseUrl}${this.endpoints?.['usersEndpoint']}/${id}/groups/${this.usersGroups.delegates}`;
    return this.http.delete(url);
  }


  isDelegated(id: string): Observable<boolean>{
    const url: string = `${this.baseUrl}${this.endpoints?.['usersEndpoint']}/${id}/groups`;
    return this.http.get<Group[]>(url)
      .pipe(
        mergeAll(),
        map(group => group.id === this.usersGroups.delegates),
        filter(result => result),
        take(1),
        defaultIfEmpty(false)
      );
  }

  resetUserPassword(id: string){
    const url: string = `${this.baseUrl}${this.endpoints?.['usersEndpoint']}/${id}/execute-actions-email`;
    return this.http.put(url, ['UPDATE_PASSWORD']);
  }



  countWithEmail(email: string, except?: string): Observable<number>{
    return this.getAllUsers().pipe(
      mergeAll(),
      filter(user => user.id !== except),
      count(user => user.email === email)
    );
  }

  countWithUsername(username: string, except?: string): Observable<number>{
    return this.getAllUsers().pipe(
      mergeAll(),
      filter(user => user.id !== except),
      count(user =>  user.username === username)
    );
  }

  countWithStudentCode(code: string, except?: string): Observable<number>{
    return merge(this.getStudents(), this.getGuests()).pipe(
      mergeAll(),
      filter(student => student.id !== except),
      count(student => student.attributes.studentCode === code)
    );
  }

  getStudentsAndGuestsByProfessor(id: string): Observable<UserDetails[]>{
    return merge(this.getStudentsByProfessor(id), this.getGuestsByProfessor(id));
  }

  getGuestByCoSupervisor(id: string): Observable<UserDetails[]>{
    return this.getGuests().pipe(
      mergeAll(),
      filter<UserDetails>(guest => guest.attributes.secondSupervisor === id),
      toArray<UserDetails>()
    );
  }


  getUsersByDepartment(deptId: string): Observable<UserDetails[]>{
    return merge(this.getProfessors(), this.getStudents(), this.getGuests())
      .pipe(
        mergeAll(),
        filter(user => user.attributes.department === deptId),
        toArray()
      );
  }

  afterDeleteDepartment(deptId: string): Observable<any>{
    return this.getUsersByDepartment(deptId).pipe(
      mergeAll(),
      concatMap(user => {
        user.attributes.department = 'none';
        return this.update(user);
      })
    );
  }



}
