import {UserDetails} from "../models/user.model";
import {Department} from "../models/department.model";
import {Category} from "../models/equipment.model";

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


export const categorySortingDataAccessor:
  (category: Category, header: string) => string | number =
  (category, header) => {
    switch (header){
      case 'ID': return category.id;
      case 'Name': return  category.name;
      default: return -1;
    }
  }



/*
* Augmented<T> help us to receive the users structure from keycloak, and transformed later
* */
export type Augmented<T> = Partial<T> & {[key: string]: any};

