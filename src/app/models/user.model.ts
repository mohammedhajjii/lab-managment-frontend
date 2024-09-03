import {Augmented} from "../utils/transformers.utils";

export class Supervisor{
  public name: string;
  public email: string;

  constructor(user: Partial<UserDetails>) {
    this.name = user.firstName + ' ' + user.lastName;
    this.email = user.email;
  }

  static widthDefault(): Supervisor{
    return new Supervisor({firstName: '[unaffected]', lastName: '', email: '[unaffected]'});
  }
}



export class Credential {
  public type: string;
  public value: string;
  public temporary: boolean;

  constructor(credential: Partial<Credential>) {
    this.type = credential.type || 'password';
    this.temporary = credential.temporary || true;
    this.value = credential.value;
  }
}




export  enum Profile {
  ADMIN = 'ADMIN',
  PROFESSOR = 'PROFESSOR',
  // DELEGATE = 'DELEGATE',
  PHD_STUDENT = 'PHD_STUDENT',
  GUEST = 'GUEST'
}



export class UserAttributes {
  public profile?: Profile;
  public department?: string;
  public studentCode?: string;
  public supervisor?: string;
  public subject?: string;
  public description?: string;
  public secondSupervisor?: string;

  constructor(attributes: Partial<UserAttributes>) {


    if (attributes.profile){
      this.profile = Array.isArray(attributes.profile) ?
        attributes.profile.pop() : attributes.profile;
    }

    if (attributes.department){
      this.department = Array.isArray(attributes.department) ?
        attributes.department.pop() : attributes.department;
    }
    if (attributes.studentCode){
      this.studentCode = Array.isArray(attributes.studentCode) ?
        attributes.studentCode.pop() : attributes.studentCode;
    }
    if (attributes.supervisor){
      this.supervisor = Array.isArray(attributes.supervisor) ?
        attributes.supervisor.pop() : attributes.supervisor;
    }
    if (attributes.subject){
      this.subject = Array.isArray(attributes.subject) ?
        attributes.subject.pop() : attributes.subject;
    }
    if(attributes.secondSupervisor){
      this.secondSupervisor = Array.isArray(attributes.secondSupervisor) ?
        attributes.secondSupervisor.pop() : attributes.secondSupervisor;
    }
    if (attributes.description){
      this.description = Array.isArray(attributes.description) ?
        attributes.description.pop() : attributes.description;
    }
  }
}


export class UserDetails {
  public id?: string;
  public createdTimestamp?: number;
  public username: string;
  public email: string;
  public emailVerified: boolean;
  public firstName: string;
  public lastName: string;
  public enabled: boolean;
  public attributes: UserAttributes;
  public credentials?: Credential[];
  public groups?: string[];

  constructor(user: Augmented<UserDetails>) {
    this.username = user.username;
    this.email = user.email;
    this.emailVerified = user.emailVerified ?? true;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.enabled = user.enabled ?? true;
    this.attributes = new UserAttributes(user.attributes);
    if (user.id){
      this.id = user.id;
    }
    if (user.createdTimestamp){
      this.createdTimestamp = user.createdTimestamp;
    }
    if(user.credentials){
      this.credentials = user.credentials;
    }
    if (user.groups){
      this.groups = user.groups;
    }
  }

  public alter(userDetails: Partial<UserDetails>){
    Object.assign(this, userDetails);
  }

}


export interface Group{
  id: string;
  name: string;
}


export const unsupervised: (user: UserDetails) => boolean = user => {
  return (user.attributes.supervisor && user.attributes.supervisor === 'none') ||
    (user.attributes.secondSupervisor && user.attributes.secondSupervisor === 'none');
}

export const normalizeToNull: (value: string) => string | null = value => {
  return value === 'none' ? null : value;
}
