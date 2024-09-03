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
import {KeycloakProfile} from "keycloak-js";
import {from, iif, mergeWith, Observable, of, switchMap, take, tap} from "rxjs";
import {Department} from "../../../models/department.model";
import {PropertyMappers} from "../../../utils/controls.template";
import {merge} from "rxjs/internal/operators/merge";

@Component({
  selector: 'app-all-users',
  templateUrl: './all-users.component.html',
  styleUrl: './all-users.component.css'
})
export class AllUsersComponent implements OnInit, AfterViewInit{

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) matSort: MatSort;

  readonly keyword: FormControl = new FormControl<string>(null);
  readonly filteredByProf: FormControl = new FormControl<string>(null);


  readonly displayedColumns: string[] = [
    'Username',
    'Email',
    'Firstname',
    'Lastname',
    'Department',
    'Edit',
    'Delete'
  ];


  dataSource: MatTableDataSource<UserDetails>;
  kind: Profile;
  isAdmin!: boolean;
  managerProfile!: KeycloakProfile;
  professors!: UserDetails[];
  departments!: Department[];


  constructor(private userServices: UserService,
              private activatedRoute: ActivatedRoute,
              private dialogService: MatDialog,
              private snackBarService: MatSnackBar) {}


  ngOnInit(): void {

    this.activatedRoute.queryParamMap.subscribe({
      next: queryParamMap => {
        this.kind = queryParamMap.get('profile') as Profile;
        this.isAdmin = Boolean(queryParamMap.get('isAdmin')) ?? false;

        console.log('is admin => ' + this.isAdmin);
      }
    });

    this.activatedRoute.data.subscribe({
      next: data => {
        this.dataSource = new MatTableDataSource(data['users'] as UserDetails[]);
        this.managerProfile = data['profile'] as KeycloakProfile;
        this.professors = data['professors'] as UserDetails[];
        this.departments = data['departments'] as Department[];
      }
    });

    this.dataSource.sortingDataAccessor = userSortingDataAccessor;

  }



  openAddUserDialog() {

    const dialogRef = this.dialogService.open<UserCreationComponent, UserCreationDialogData, DialogClosingState>(
      UserCreationComponent,
      userCreationDialogConfig({
        kind: this.kind,
        isAdmin: this.isAdmin,
        userContext: this.managerProfile,
        professors: this.professors,
        departments: this.departments
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
      next: value => {
        if (value.trim() !== ''){
          this.dataSource.filter = value;
          if (this.dataSource.paginator)
            this.dataSource.paginator.firstPage();
        }
      }
    });

    this.filteredByProf.valueChanges
      .pipe(
        switchMap(value => this.reloadUserList(value))
      )
      .subscribe({
        next: users => {
          this.dataSource.data = users;
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
              error: err => {
                this.snackBarService.openFromComponent<SnackBarComponent, NotificationData>(
                  SnackBarComponent,
                  notificationConfig({
                    operation: 'deleting user was ',
                    success: false
                  })
                )
              },
              complete: () => {
                this.snackBarService.openFromComponent<SnackBarComponent, NotificationData>(
                  SnackBarComponent,
                  notificationConfig({
                    operation: 'user deleted ',
                    success: true
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
    this.reloadUserList(this.filteredByProf.value)
      .subscribe({
        next: userDetailsList => {
          this.dataSource.data = userDetailsList;
        }
      })
  }

  reloadUserList(criteria: string | null): Observable<UserDetails[]>{

    switch (criteria){
      case null:
      case '*':
        return this.userServices.getUsersByProfile(this.kind);
      case 'none':
        return this.userServices.getUnsupervised(this.kind);
      default:
        return this.userServices.getSupervisedBySupervisor(criteria, this.kind);
    }
  }

  protected readonly Profile = Profile;
  protected readonly PropertyMappers = PropertyMappers;
}
