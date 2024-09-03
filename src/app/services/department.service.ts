import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Department} from "../models/department.model";

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  readonly departmentEndpoint: string = environment.departmentApi.baseUrl;

  constructor(private http: HttpClient) {}

  getDepartments(): Observable<Department[]>{
    return this.http.get<Department[]>(this.departmentEndpoint);
  }

  getDepartmentById(id: string): Observable<Department>{
    const url: string = `${this.departmentEndpoint}/${id}`
    return this.http.get<Department>(url);
  }

  createDepartment(name: string): Observable<Department>{
    return this.http.post<Department>(this.departmentEndpoint, name);
  }

  updateDepartment(id: string, name: string): Observable<Department>{
    const url: string = `${this.departmentEndpoint}/${id}`;
    return this.http.put<Department>(url, name);
  }

  deleteDepartment(id: string):  Observable<Object> {
    const url: string = `${this.departmentEndpoint}/${id}`;
    return this.http.delete(url)
  }

  existsByName(name: string, exclude?: string): Observable<boolean>{
    const url: string = exclude ?
      `${this.departmentEndpoint}/exists/${name}/exclude/${exclude}`:
      `${this.departmentEndpoint}/exists/${name}`;
    return this.http.get<boolean>(url);
  }
}
