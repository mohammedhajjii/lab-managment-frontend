import {Department} from "../models/department.model";
import {ResolveFn} from "@angular/router";
import {of} from "rxjs";
import {DepartmentService} from "../services/department.service";
import {inject} from "@angular/core";


const departmentList: Department[] = [
  {id: 'id-1', name: 'Computer sciences', code: 'CS', creationTimestamp: 1725308505385},
  {id: 'id-2', name: 'Mechanics', code: 'MC', creationTimestamp: 1725308505497},
  {id: 'id-3', name: 'Logistics', code: 'LG', creationTimestamp: 1725308505499},
];


export const departmentResolver: ResolveFn<Department[]> = () => {
  const departmentService: DepartmentService = inject<DepartmentService>(DepartmentService);
  return departmentService.getDepartments();
}
