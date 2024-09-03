import {AfterViewInit, Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Credential, Profile, UserAttributes, UserDetails} from "../../../models/user.model";
import {
  asyncEmailValidator,
  asyncStudentCodeValidator,
  asyncUsernameValidator
} from "../../../validators/async.validators";
import {UserService} from "../../../services/user.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {DialogClosingState, notificationConfig, UserCreationDialogData} from "../../../utils/popup.utils";
import {MatSnackBar} from "@angular/material/snack-bar";
import {SnackBarComponent} from "../../popup/snack-bar/snack-bar.component";
import {
  CredentialsFormGroupData,
  CredentialsFromGroupTemplate, DepartmentDetailsFormGroupData,
  DepartmentDetailsFromGroupTemplate, GeneralFormGroupData,
  GeneralFormGroupTemplate, getControl, PropertyMappers
} from "../../../utils/controls.template";
import {switchMap} from "rxjs";
import {keyframes} from "@angular/animations";

@Component({
  selector: 'app-user-creation',
  templateUrl: './user-creation.component.html',
  styleUrl: './user-creation.component.css'
})
export class UserCreationComponent implements OnInit, AfterViewInit {

  generalFormGroupTemplate!: FormGroup<GeneralFormGroupTemplate>;
  departmentDetailsFromGroupTemplate!: FormGroup<DepartmentDetailsFromGroupTemplate>;
  credentialsFromGroupTemplate!: FormGroup<CredentialsFromGroupTemplate>;

  generalFormGroupData!: GeneralFormGroupData;
  departmentDetailsFormGroupData!: DepartmentDetailsFormGroupData;
  credentialsFormGroupData!: CredentialsFormGroupData;


  protected readonly Profile = Profile;
  kind!: Profile;
  phdStudents!: UserDetails[];


 constructor(private userService: UserService,
             private snackBar: MatSnackBar,
             private dialogRef: MatDialogRef<UserCreationComponent>, //on submit
             @Inject(MAT_DIALOG_DATA) public dialogData: UserCreationDialogData) {}

  ngOnInit(): void {

   this.generalFormGroupTemplate = new FormGroup<GeneralFormGroupTemplate>({
     firstName: new FormControl<string>('', Validators.required),
     lastName: new FormControl<string>('', Validators.required),
     email: new FormControl<string>('', {
       validators: [Validators.required, Validators.email],
       asyncValidators: asyncEmailValidator(this.userService)
     })
   });


   this.departmentDetailsFromGroupTemplate = new FormGroup<DepartmentDetailsFromGroupTemplate>({
     department: new FormControl<string>(null, Validators.required)
   });


   this.credentialsFromGroupTemplate = new FormGroup<CredentialsFromGroupTemplate>({
     username: new FormControl<string>(null, {
       validators: Validators.required,
       asyncValidators: asyncUsernameValidator(this.userService)
     }),
     password: new FormControl<string>('', {
       validators: [Validators.required, Validators.minLength(10)]
     })
   });


    this.kind = this.dialogData.kind;


    if (this.kind === Profile.GUEST ||
      this.kind === Profile.PHD_STUDENT){

      this.departmentDetailsFromGroupTemplate.addControl(
        'studentCode',
        new FormControl<string>(null, {
          validators: [Validators.required, Validators.pattern(/^[A-Z]\d{9}$/)],
          asyncValidators: asyncStudentCodeValidator(this.userService)
        }));

      this.departmentDetailsFromGroupTemplate.addControl(
        'subject',
        new FormControl<string>(null, Validators.required)
      );

      this.departmentDetailsFromGroupTemplate.addControl(
        'supervisor',
        new FormControl<string>(null, {
          validators: Validators.required
        })
      );


    }

    if (this.kind === Profile.GUEST){
      this.departmentDetailsFromGroupTemplate.addControl(
        'secondSupervisor',
        new FormControl<string>(null, Validators.required)
      );
      this.departmentDetailsFromGroupTemplate.addControl(
        'description', new FormControl<string>(null)
      );
    }



    this.generalFormGroupTemplate.statusChanges.subscribe((status) => {
      if (status === 'VALID'){
        this.generalFormGroupData = this.generalFormGroupTemplate.getRawValue();
        this.credentialsFromGroupTemplate.patchValue({
          username: this.generalFormGroupData.email.split('@')[0]
        });
      }
    });

    this.departmentDetailsFromGroupTemplate.statusChanges.subscribe((status) => {
      if (status === 'VALID'){
        this.departmentDetailsFormGroupData = this.departmentDetailsFromGroupTemplate.getRawValue();
      }
    });

    this.credentialsFromGroupTemplate.statusChanges.subscribe((status) => {
      if (status === 'VALID'){
        this.credentialsFormGroupData = this.credentialsFromGroupTemplate.getRawValue();
      }
    });

  }



  private getGroups(profile: Profile): string[]{
   switch (profile){
     case Profile.PHD_STUDENT: return ['phd_students'];
     case Profile.GUEST: return ['guests'];
     default: return ['professors'];
   }
  }

  createUser() {

   const {username, password} = this.credentialsFormGroupData;

    const userDetails: UserDetails = new UserDetails({
      username: username,
      attributes:  new UserAttributes({
          profile: this.kind,
          ...this.departmentDetailsFormGroupData
        }
      ),
      credentials: [
        new Credential({value: password})
      ],
      groups: this.getGroups(this.kind),
      ...this.generalFormGroupData
    })


    console.log(userDetails);

    this.userService.create(userDetails).subscribe({
      next: value => {
        this.snackBar.openFromComponent<SnackBarComponent>(
          SnackBarComponent,
          notificationConfig(
            {
              operation: 'user created ',
              success: true
            }
          )
        );
        this.dialogRef.close(DialogClosingState.SUBMITTED);
      },
      error: err => {
        this.snackBar.openFromComponent<SnackBarComponent>(
          SnackBarComponent,
          notificationConfig(
            {
              operation: 'user creation ',
              success: false
            }
          )
        );
      }
    });

  }


  ngAfterViewInit(): void {

   if(this.kind === Profile.PHD_STUDENT ||
     this.kind === Profile.GUEST) {

     getControl(this.departmentDetailsFromGroupTemplate, 'supervisor')
       .valueChanges
       .pipe(
         switchMap(supervisor => this.userService.getStudentsByProfessor(supervisor))
       )
       .subscribe({
         next: students => {
           this.phdStudents = students;
           if (this.departmentDetailsFromGroupTemplate.contains('secondSupervisor'))
             getControl(this.departmentDetailsFromGroupTemplate, 'secondSupervisor')
               .reset();
         }
       });

     getControl(this.departmentDetailsFromGroupTemplate, 'supervisor')
       .setValue(this.dialogData.isAdmin ? null: this.dialogData.userContext.id);

   }


  }


  protected readonly DialogClosingState = DialogClosingState;
  protected readonly PropertyMappers = PropertyMappers;
  protected readonly getControl = getControl;


}





