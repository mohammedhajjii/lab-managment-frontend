import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {Department} from "../../../models/department.model";
import {ActivatedRoute} from "@angular/router";
import {departmentSortingDataAccessor} from "../../../utils/transformers.utils";
import {FormControl} from "@angular/forms";
import {DepartmentService} from "../../../services/department.service";
import {MatDialog} from "@angular/material/dialog";
import {CreateDepartmentComponent} from "../create-department/create-department.component";
import {DepartmentCreationStatus, departmentPopupConfig, DepartmentPopupData} from "../../../utils/popup.utils";

@Component({
  selector: 'app-all-departments',
  templateUrl: './all-departments.component.html',
  styleUrl: './all-departments.component.css'
})
export class AllDepartmentsComponent implements OnInit, AfterViewInit{

  readonly displayedColumns: string[] = [
    'ID',
    'Department name',
    'Department code',
    'Creation date',
    'Edit',
    'Delete'
  ];

  readonly filterField: FormControl<string> = new FormControl<string>('');

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) matSort: MatSort;
  datasource!: MatTableDataSource<Department>;


  constructor(private activatedRoute: ActivatedRoute,
              private departmentService: DepartmentService,
              private dialogService: MatDialog) {}


  ngOnInit(): void {

    this.activatedRoute.data.subscribe({
      next: data => {
        this.datasource = new MatTableDataSource<Department>(data['departments'] as Department[]);
      }
    });

    this.datasource.sortingDataAccessor = departmentSortingDataAccessor;
  }

  ngAfterViewInit(): void {
    this.datasource.paginator = this.paginator;
    this.datasource.sort = this.matSort;

    this.filterField.valueChanges.subscribe({
      next: keyword => {
        this.filterByKeyword(keyword);
      }
    })
  }

  updateDepartment(id: string) {
    console.log('rceived id: '+ id);
  }

  deleteDepartment(id: string) {
    console.log('rceived id: '+ id);
  }

  filterByKeyword(keyword: string): void{
    if (keyword.trim() !== ''){
      this.datasource.filter = keyword;
      if (this.datasource.paginator)
        this.datasource.paginator.firstPage();
    }
  }

  openDepartmentDialogPopup(mode: 'create' | 'update', id?: string, name?: string ): void{
    const departmentDialogRef = this.dialogService
      .open<CreateDepartmentComponent, DepartmentPopupData, DepartmentCreationStatus>(
        CreateDepartmentComponent,
        departmentPopupConfig({
          mode: mode,
          deptId: id,
          deptName: name
        })
      );

    departmentDialogRef.afterClosed()
      .subscribe({
        next: status => {
          if (status === DepartmentCreationStatus.DONE)
            this.refresh();
        }
      });
  }

  refresh(): void{
    this.departmentService.getDepartments().subscribe({
      next: departments => {
        this.datasource.data = departments;
      }
    })
  }
}
