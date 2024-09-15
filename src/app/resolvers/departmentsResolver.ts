import {Department} from "../models/department.model";
import {ResolveFn} from "@angular/router";
import {of} from "rxjs";
import {DepartmentService} from "../services/department.service";
import {inject} from "@angular/core";



export const departmentsResolver: ResolveFn<Department[]> = () => {
  const departmentService: DepartmentService = inject<DepartmentService>(DepartmentService);
  return departmentService.getDepartments();
}
