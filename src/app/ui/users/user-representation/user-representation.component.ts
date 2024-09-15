import {AfterViewInit, Component, OnInit} from '@angular/core';
import {normalizeToNull, Profile, UserDetails} from "../../../models/user.model";
import {ActivatedRoute} from "@angular/router";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {
  DepartmentDetailsFromGroupTemplate,
  GeneralFormGroupTemplate, getControl, Mappers
} from "../../../utils/controls.template";
import {asyncEmailValidator, asyncStudentCodeValidator} from "../../../validators/async.validators";
import {UserService} from "../../../services/user.service";
import {DatePipe} from "@angular/common";
import {Department} from "../../../models/department.model";
import {Field, FieldSet, ProfileOverview} from "../../../utils/field.utils";
import {MatSnackBar} from "@angular/material/snack-bar";
import {SnackBarComponent} from "../../popup/snack-bar/snack-bar.component";
import {confirmDialogConfig, ConfirmDialogData, notificationConfig, NotificationData} from "../../../utils/popup.utils";
import {iif, Observable, switchMap} from "rxjs";
import {CanExit} from "../../../guards/leave.guard";
import {MatDialog} from "@angular/material/dialog";
import {ConfirmComponent} from "../../popup/confirm/confirm.component";
import {Predicates} from "../../../utils/filters.utils";

@Component({
  selector: 'app-user-representation',
  templateUrl: './user-representation.component.html',
  styleUrl: './user-representation.component.css'
})
export class UserRepresentationComponent implements OnInit, AfterViewInit ,CanExit{

  protected readonly Profile = Profile;
  protected readonly PropertyMappers = Mappers;
  protected readonly getControl = getControl;

  managedUser: UserDetails;
  managerProfile!: UserDetails;

  //formGroups:
  generalFormGroup!: FormGroup<GeneralFormGroupTemplate>;
  departmentFormGroup!: FormGroup<DepartmentDetailsFromGroupTemplate>;


  //fieldSet
  profileOverviewFieldSet!: FieldSet<ProfileOverview>;

  allDepartments!: Department[];
  allProfessors!: UserDetails[];
  allStudents!: UserDetails[];

  filteredDepartments!: Department[];
  filteredProfessors!: UserDetails[];
  filteredStudents!: UserDetails[];



  readonly delegatePredicate: FormControl<boolean> = new FormControl<boolean>(null);

  readonly resetTips: string = 'in order to update user password, you can send email to that user containing the update password link';
  readonly enableTips: string = 'the enabled option can block ar unblock user, the blocked user cannot access his account';
  readonly delegateTips: string = 'make the current student as a delegate, so he can act like a professor';

  displayRestPasswordProcessSpinner: boolean = false;

  constructor(private activatedRoute: ActivatedRoute,
              private datePipe: DatePipe,
              private dialogService: MatDialog,
              private snackBarService: MatSnackBar,
              private userService: UserService) {
  }

  ngOnInit(): void {

    this.activatedRoute.data.subscribe({
      next: data => {
        this.managedUser = data['managedUser'] as UserDetails;
        this.managerProfile = data['profile'] as UserDetails;
        this.delegatePredicate.setValue(data['delegatePredicate'] as boolean);
        this.allDepartments = data['departments'] as Department[];
        this.allProfessors = data['professors'] as UserDetails[];
        this.allStudents = data['students'] as UserDetails[];
      }
    });


    this.filteredDepartments = this.allDepartments.filter(Predicates.all);
    this.filteredProfessors = this.allProfessors.filter(Predicates.all);
    this.filteredStudents = this.allStudents.filter(Predicates.all);

    this.profileOverviewFieldSet = new FieldSet<ProfileOverview>({
      id: new Field<string>({
        label: 'ID',
        value: this.managedUser.id,
        readOnly: true
      }),
      username: new Field<string>({
        label: 'Username',
        value: this.managedUser.username,
        readOnly: true
      }),
      createdAt: new Field<string>({
        label: 'Created at',
        value: this.datePipe.transform(this.managedUser.createdTimestamp, 'medium'),
        readOnly: true
      }),
    });


    this.generalFormGroup = new FormGroup<GeneralFormGroupTemplate>({
      email: new FormControl<string>(
        this.managedUser.email, {
        validators: [Validators.required, Validators.email],
        asyncValidators: asyncEmailValidator(this.userService, this.managedUser.id)
      }),
      firstName: new FormControl<string>(
        this.managedUser.firstName, {
        validators: Validators.required
      }),
      lastName: new FormControl<string>(
        this.managedUser.lastName, {
        validators: Validators.required
      }),
      enabled: new FormControl<boolean>(this.managedUser.enabled)
    });

    this.departmentFormGroup = new FormGroup<DepartmentDetailsFromGroupTemplate>({
      department: new FormControl<string>(null, {
        validators: Validators.required
      })
    });


    const managedUserProfile: Profile = this.managedUser.attributes.profile;

    if (managedUserProfile === Profile.PHD_STUDENT ||
      managedUserProfile === Profile.GUEST){

      this.departmentFormGroup.addControl('studentCode', new FormControl<string>(
        null,
        {
          validators: [Validators.required, Validators.pattern(/^[A-Z]\d{9}$/)],
          asyncValidators: asyncStudentCodeValidator(this.userService, this.managedUser.id)
        }
      ));

      this.departmentFormGroup.addControl('subject', new FormControl<string>(
       null,
        {
          validators: Validators.required
        }
      ));

      this.departmentFormGroup.addControl('supervisor', new FormControl<string>(
        null,
        {
          validators: Validators.required
        }
      ));


    }


    if (managedUserProfile === Profile.GUEST){

      this.departmentFormGroup.addControl('secondSupervisor', new FormControl<string>(
        null,
        {
          validators: Validators.required
        }
      ));

    }
  }


  ngAfterViewInit(): void {

    getControl(this.departmentFormGroup, 'department')
      .valueChanges
      .subscribe({
        next: department => {

          if (this.departmentFormGroup.contains('supervisor')){

            this.filteredProfessors = this.allProfessors
              .filter(prof => prof.attributes.department === department);

            if (this.departmentFormGroup.contains('supervisor')){
              getControl(this.departmentFormGroup, 'supervisor')
                .reset(null);
            }
          }
        }
      });

    if (this.departmentFormGroup.contains('supervisor')){
      getControl(this.departmentFormGroup, 'supervisor')
        .valueChanges
        .subscribe({
          next: prof => {
            this.filteredStudents = this.allStudents
              .filter(student => student.attributes.supervisor === prof);

            if (this.departmentFormGroup.contains('secondSupervisor')){
              getControl(this.departmentFormGroup, 'secondSupervisor')
                .reset(null);
            }
          }
        });
    }

    setTimeout(() => {
      this.reset();
    });


  }


  saveUserDetails(): void{
    this.managedUser.alter({
      ...this.generalFormGroup.getRawValue(),
      attributes: {
        ...this.managedUser.attributes,
        ...this.departmentFormGroup.getRawValue()
      }
    });

    console.log(this.managedUser);

    this.userService.update(this.managedUser)
      .subscribe({
        error: () => {
          this.snackBarService.openFromComponent<SnackBarComponent, NotificationData>(
            SnackBarComponent,
            notificationConfig({
              type: 'error',
              message: 'update user details failed'
            })
          )
        },
        complete: () => {
          this.snackBarService.openFromComponent<SnackBarComponent, NotificationData>(
            SnackBarComponent,
            notificationConfig({
              type: 'success',
              message: 'user details updated successfully'
            })
          )
        }
      });

    this.reset();
  }

  resetUSerPassword(id: string): void{
    this.displayRestPasswordProcessSpinner = true;
      this.userService.resetUserPassword(id)
        .subscribe({
          error: () => {
            this.snackBarService.openFromComponent<SnackBarComponent, NotificationData>(
              SnackBarComponent,
              notificationConfig({
                type: 'error',
                message: 'reset password failed'
              })
            );
            this.displayRestPasswordProcessSpinner = false;
          },
          complete: () => {
            this.snackBarService.openFromComponent<SnackBarComponent, NotificationData>(
              SnackBarComponent,
              notificationConfig({
                message: 'reset password email was sent',
                type: 'success'
              })
            );
            this.displayRestPasswordProcessSpinner = false;
          }
        })
  }

  delegateToggle(id: string): void{
    iif(
      () => this.delegatePredicate.value,
      this.userService.delegate(id),
      this.userService.unDelegate(id)
    ).subscribe({
      error: err => {
        this.snackBarService.openFromComponent<SnackBarComponent, NotificationData>(
          SnackBarComponent,
          notificationConfig({
            message: 'update student role failed',
            type: 'error'
          })
        );
      },
      complete: () => {
        this.snackBarService.openFromComponent<SnackBarComponent, NotificationData>(
          SnackBarComponent,
          notificationConfig({
            message: 'student role has been updated successfully',
            type: 'success'
          })
        );
      }
    })

  }


  userDetailsHasBeenAltered(): boolean{
    return (this.generalFormGroup.valid && this.departmentFormGroup.valid)
            && (this.generalFormGroup.dirty || this.departmentFormGroup.dirty);
  }

  enableResetOption(): boolean{
    return this.generalFormGroup.dirty || this.departmentFormGroup.dirty;
  }

  reset(): void{

    this.generalFormGroup.reset({
      email: this.managedUser.email,
      firstName: this.managedUser.firstName,
      lastName: this.managedUser.lastName,
      enabled: this.managedUser.enabled
    });

    this.departmentFormGroup.reset({
      department: normalizeToNull(this.managedUser.attributes.department),
      studentCode: this.managedUser.attributes.studentCode,
      supervisor: normalizeToNull(this.managedUser.attributes.supervisor),
      subject: this.managedUser.attributes.subject,
      secondSupervisor: normalizeToNull(this.managedUser.attributes.secondSupervisor),
      description: this.managedUser.attributes.description
    });

  }




  canExit(): Observable<boolean> | Promise<boolean> | boolean {

    if(this.generalFormGroup.dirty || this.departmentFormGroup.dirty){
      const confirmDialogRef = this.dialogService.open<ConfirmComponent, ConfirmDialogData, boolean>(
        ConfirmComponent,
        confirmDialogConfig({
          title: 'Discard changes ?',
          message: 'your changes will be ignored, continue ?'
        })
      );
      return confirmDialogRef.afterClosed();
    }
    return true;
  }





}
