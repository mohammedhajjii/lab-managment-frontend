import {UserAttributes, UserDetails} from "../models/user.model";
import {Department} from "../models/department.model";

export function mapToSingle<T>(record: {[K in keyof T]: T[K]}) : void {
  Object.keys(record)
    .map(key => key as keyof T)
    .forEach(key => {
      record[key] = Array.isArray(record[key]) ? (record[key] as any[]).pop() : record[key];
    })
}

/** ----------------------- define data sorting accessor --------------------------**/

/**
 *
 * @param user
 * @param header
 */

export const userSortingDataAccessor = function (user: UserDetails, header: string): string | number{
  switch (header){
    case 'Department': return user.attributes.department;
    case 'Firstname': return user.firstName;
    case 'Lastname': return user.lastName;
    case 'Email': return user.email;
    default: return user.username;
  }
}

export const departmentSortingDataAccessor:
  (dept: Department, header: string) => string | number =
  (dept, header) => {
  switch (header){
    case 'ID': return dept.id;
    case 'Department name': return dept.name;
    case 'Department code': return dept.code;
    case 'Creation date': return dept.creationTimestamp;
    default: return -1;
  }
}



/*
* Augmented<T> help us to receive the users structure from keycloak, and transformed later
* */
export type Augmented<T> = Partial<T> & {[key: string]: any};

export function mapToUserDetails(input: Augmented<UserDetails>): UserDetails{
  const user: UserDetails = new UserDetails(input);
  mapToSingle<UserAttributes>(user.attributes);
  return user;
}
