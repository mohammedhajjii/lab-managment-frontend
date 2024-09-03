import {Credential} from "./user.model";


export class GeneralFromData {
  public username: string;
  public email: string;
  public firstName: string;
  public lastName: string;
  public enabled?: boolean;
  public emailVerified: boolean;
  public groups: string[];

  constructor(data: Partial<GeneralFromData>) {
    this.enabled = data.enabled || true;
    Object.assign(this, data);
  }
}

export class AcademicFormData {
  public department: string;
  public studentCode?: string;
  public supervisor?: string;
  public subject?: string;
  public secondSupervisor?: string;
  public description?: string;

  constructor(data: Partial<AcademicFormData>) {
    Object.assign(this, data);
  }

}



export type GeneralFormDataExcludingPhone = Omit<GeneralFromData, 'phone'>;
