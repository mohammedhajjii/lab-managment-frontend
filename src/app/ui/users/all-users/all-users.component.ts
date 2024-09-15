import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {FormControl} from "@angular/forms";
import {Profile, UserDetails} from "../../../models/user.model";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {UserService} from "../../../services/user.service";
import {ActivatedRoute} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {UserCreationComponent} from "../user-creation/user-creation.component";
import {
  confirmDialogConfig,
  ConfirmDialogData,
  DialogClosingState,
  notificationConfig,
  NotificationData,
  userCreationDialogConfig,
  UserCreationDialogData
} from "../../../utils/popup.utils";
import {userSortingDataAccessor} from "../../../utils/transformers.utils";
import {MatSnackBar} from "@angular/material/snack-bar";
import {SnackBarComponent} from "../../popup/snack-bar/snack-bar.component";
import {ConfirmComponent} from "../../popup/confirm/confirm.component";
import {Observable, switchMap} from "rxjs";
import {Department} from "../../../models/department.model";
import {Mappers} from "../../../utils/controls.template";
import {
  FilterControl,
  FilterGroup,
  FilterGroupData,
  SubscriberMap,
  UserFilter,
  usersFilterSubscribersMap
} from "../../../utils/filters.utils";

@Component({
  selector: 'app-all-users',
  templateUrl: './all-users.component.html',
  styleUrl: './all-users.component.css'
})
export class AllUsersComponent implements OnInit, AfterViewInit{

  protected readonly Profile = Profile;

  dataSource: MatTableDataSource<UserDetails>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) matSort: MatSort;

  readonly keyword: FormControl = new FormControl<string>(null);


  userFilterGroup!: FilterGroup<UserFilter>;
  userFilterSubscriberMap: SubscriberMap<UserFilter>;

  readonly displayedColumns: string[] = [
    'Username',
    'Email',
    'Firstname',
    'Lastname',
    'Department',
    'Edit',
    'Delete'
  ];


  kind: Profile;
  isAdmin!: boolean;
  managerProfile!: UserDetails;
  departments!: Department[];
  professors!: UserDetails[];
  students!: UserDetails[];


  constructor(private userServices: UserService,
              private activatedRoute: ActivatedRoute,
              private dialogService: MatDialog,
              private snackBarService: MatSnackBar) {}


  ngOnInit(): void {

    this.activatedRoute.queryParamMap.subscribe({
      next: queryParamMap => {
        this.kind = queryParamMap.get('profile') as Profile;
        this.isAdmin = Boolean(queryParamMap.get('isAdmin')) ?? false;
      }
    });

    this.activatedRoute.data.subscribe({
      next: data => {
        this.dataSource = new MatTableDataSource(data['users'] as UserDetails[]);
        this.managerProfile = data['profile'] as UserDetails;
        this.departments = data['departments'] as Department[];
        this.professors = data['professors'] as UserDetails[];
        this.students = data['students'] as UserDetails[];
      }
    });

    this.dataSource.sortingDataAccessor = userSortingDataAccessor;


   this.setUserFilterGroup();

  }



  openAddUserDialog() {

    const dialogRef = this.dialogService
      .open<UserCreationComponent, UserCreationDialogData, DialogClosingState>(
        UserCreationComponent,
        userCreationDialogConfig({
          kind: this.kind,
          isAdmin: this.isAdmin,
          userContext: this.managerProfile,
          professors: this.professors,
          departments: this.departments,
          students: this.students
        })
    );
    dialogRef.afterClosed().subscribe({
      next: state => {
        if (state === DialogClosingState.SUBMITTED){
          this.refresh();
        }
      }
    })
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.matSort;

    this.keyword.valueChanges.subscribe({
      next: keyword => {
        this.filterByKeyword(keyword);
      }
    });

  }


  deleteUser(id: string, name: string){

    const confirmDialogRef = this.dialogService.open<ConfirmComponent, ConfirmDialogData, boolean>(
      ConfirmComponent,
      confirmDialogConfig({
        title: 'Delete user ?',
        message: `delete ${name}`
      })
    );

    confirmDialogRef.afterClosed().subscribe({
      next: response => {
        if (response){
          this.userServices.safeDelete(id, this.kind)
            .subscribe({
              error: () => {
                this.snackBarService.openFromComponent<SnackBarComponent, NotificationData>(
                  SnackBarComponent,
                  notificationConfig({
                    type: 'success',
                    message: 'delete user failed'
                  })
                )
              },
              complete: () => {
                this.snackBarService.openFromComponent<SnackBarComponent, NotificationData>(
                  SnackBarComponent,
                  notificationConfig({
                    type: 'success',
                    message: 'user deleted successfully'
                  })
                );
                this.refresh();
              }
            })
        }
      }
    });
  }

  refresh() {
    this.filterChanges(this.userFilterGroup.getRawValues());
  }

  filterByKeyword(keyword: string): void{
    if(!keyword.trim()){
      this.dataSource.filter = '';
    }
    else {
      this.dataSource.filter = keyword;
      if (this.dataSource.paginator)
        this.dataSource.paginator.firstPage();
    }
  }


  setUserFilterGroup(): void{

    console.log(`managerID: ${this.isAdmin ? undefined: this.managerProfile.id}`)

    this.userFilterGroup = new FilterGroup<UserFilter>({
      department: new FilterControl<Department, UserDetails, string, UserDetails>({
        label: 'Filter by department',
        placeholder: 'department',
        origin: this.departments,
        valueMapper: Mappers.departmentValueMapper,
        labelMapper: Mappers.departmentLabelMapper,
        all: '*',
        none: 'none',
        visible: this.isAdmin,
        internal: value => user => user.attributes.department === value,
        external: value => user => user.attributes.department === value,
      }),
      professor:  new FilterControl<UserDetails, UserDetails, string>({
        label: 'Filter by supervisor',
        placeholder: 'supervisor',
        origin: this.professors,
        valueMapper: Mappers.userValueMapper,
        labelMapper: Mappers.userLabelMapper,
        all: '*',
        none: 'none',
        visible: this.isAdmin && (this.kind === Profile.PHD_STUDENT || this.kind === Profile.GUEST),
        defaultValue: this.isAdmin ? undefined: this.managerProfile.id,
        internal: value => user => user.attributes.supervisor === value,
        external: value => user => user.attributes.supervisor === value,
      }),
      student: new FilterControl<UserDetails, UserDetails, string>({
        label: 'Filter by co-supervisor',
        placeholder: 'co-supervisor',
        origin: this.students,
        valueMapper: Mappers.userValueMapper,
        labelMapper: Mappers.userLabelMapper,
        all: '*',
        none: 'none',
        visible: this.kind === Profile.GUEST,
        external: value => user => user.attributes.secondSupervisor === value
      })
    });
    this.userFilterSubscriberMap =  usersFilterSubscribersMap;
  }


  filterChanges(values: FilterGroupData<UserFilter>) {
    this.userServices.getUsersByProfile(this.kind)
      .subscribe({
        next: users => {
          let filteredData: UserDetails[] = users;
          if (values.department){
            filteredData = filteredData
              .filter(
                this.userFilterGroup.getFilterControl('department')
                  .applyExternalPredicateFn(values.department)
              );
          }
          if (values.professor){
            filteredData = filteredData
              .filter(
                this.userFilterGroup.getFilterControl('professor')
                  .applyExternalPredicateFn(values.professor)
              );
          }

          if (values.student){
            filteredData = filteredData
              .filter(
                this.userFilterGroup.getFilterControl('student')
                  .applyExternalPredicateFn(values.student)
              );
          }
          this.dataSource.data = filteredData;
        }
      });
  }
}
