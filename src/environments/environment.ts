import {Injectable} from "@angular/core";


export interface Environment {
  keycloakAdminApi: Api;
  departmentApi: Api,
  keycloakGroups: UserGroups;
}



export interface Api{
  baseUrl: string;
  endpoints?: Record<string, string>;
}

export const environment: Environment = {
  keycloakAdminApi: {
    baseUrl: 'http://localhost:8080/admin/realms/lab-management',
    endpoints: {
      usersEndpoint: '/users',
      groupsEndpoint: '/groups'
    }
  },
  departmentApi: {
    baseUrl: 'http://localhost:9091/departments',
  },
  keycloakGroups: {
    professors: 'c8736d42-d1e4-426f-ba81-a3dd83460e75',
    phdStudents: '6e2b35ab-9f96-4b8b-b2ca-a5ae36fb53b8',
    guests: 'bdeda6bb-909d-42e1-be9e-dfd77b8fbb29',
    delegates: '19b2b4bb-0fe3-4894-9aae-064b6168bed2'
  }
}


export interface UserGroups {
  professors: string;
  phdStudents: string;
  guests: string;
  delegates: string;
}

