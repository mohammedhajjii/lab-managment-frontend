import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Profile, Supervisor, UserAttributes, UserDetails} from "../../models/user.model";
import {DatePipe} from "@angular/common";
import {
  AcademicFieldSetTemplate,
  BasicFieldSetTemplate,
  CreationFieldSetTemplate,
  Field,
  FieldSet
} from "../../utils/field.utils";
import {Validators} from "@angular/forms";
import {asyncEmailValidator} from "../../validators/async.validators";
import {UserService} from "../../services/user.service";
import {Department} from "../../models/department.model";
import {CanExit} from "../../guards/leave.guard";
import {MatDialog} from "@angular/material/dialog";
import {ConfirmComponent} from "../popup/confirm/confirm.component";
import {
  confirmDialogConfig,
  ConfirmDialogData,
  notificationConfig
} from "../../utils/popup.utils";
import {map, Observable} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";
import {SnackBarComponent} from "../popup/snack-bar/snack-bar.component";
import {FragmentDetails} from "../fragment/fragment.component";

@Component({
  selector: 'app-profile-infos',
  templateUrl: './profile-infos.component.html',
  styleUrl: './profile-infos.component.css',

})
export class ProfileInfosComponent implements OnInit, CanExit{

  departmentList!: Department[];
  authenticatedUserDetails!: UserDetails;
  managerDetails!: Supervisor;
  coManagerDetails!: Supervisor;
  isDelegated!: boolean;
  label!: string;

  //fieldSets:
  creationFieldSetTemplate!: FieldSet<CreationFieldSetTemplate>;
  basicFieldSetTemplate!: FieldSet<BasicFieldSetTemplate>;
  academicFieldSetTemplate!: FieldSet<AcademicFieldSetTemplate>;


  //fragments:
   fragments: FragmentDetails[] = [
    {id: 'fr-1', label: 'preview'},
    {id: 'fr-2', label: 'system details'},
    {id: 'fr-3', label: 'General details'},
    {id: 'fr-4', label: 'academic details'}
  ];

  constructor(private activatedRoute: ActivatedRoute,
              private userService: UserService,
              private dialogService: MatDialog,
              private snackBarService: MatSnackBar,
              private datePipe: DatePipe) {}

  ngOnInit(): void {

    this.activatedRoute.data.subscribe({
      next: data => {
        this.isDelegated = data['isDelegate'] as boolean;
        this.managerDetails = data['manager'] as Supervisor;
        this.coManagerDetails = data['coManager'] as Supervisor;
        this.departmentList = data['departments'] as Department[];
        this.authenticatedUserDetails = data['authenticatedUserDetails'] as UserDetails;
        this.label = this.authenticatedUserDetails.firstName[0]
          .concat(this.authenticatedUserDetails.lastName[0])
          .toUpperCase();
      }
    });

    this.creationFieldSetTemplate = new FieldSet<CreationFieldSetTemplate>({
      id: new Field<string>({
        label: 'Id',
        value: this.authenticatedUserDetails.id,
        readOnly: true
      }),
      createdAt: new Field<string>({
        label: 'Created at',
        value: this.datePipe.transform(this.authenticatedUserDetails?.createdTimestamp, 'medium'),
        readOnly: true
      })
    });

    const profile = this.authenticatedUserDetails.attributes.profile;
    const userAttributes: UserAttributes = this.authenticatedUserDetails.attributes;


    this.basicFieldSetTemplate = new FieldSet<BasicFieldSetTemplate>({
      username: new Field<string>({
        label: 'Username',
        value: this.authenticatedUserDetails.username,
        readOnly: true
      }),
      email: new Field<string>({
        label: 'Email',
        value: this.authenticatedUserDetails.email,
        readOnly: !this.isAdmin(profile),
        placeholder: 'Ex: example@gmail.com',
        inputType: 'email',
        validators: [Validators.required, Validators.email],
        asyncValidators: asyncEmailValidator(
          this.userService,
          this.authenticatedUserDetails.id
        ),
        errors: {
          required: 'the email field is required',
          email: 'invalid email format',
          emailInUse: 'the provided email is already used'
        }
      }),
      firstname: new Field<string>({
        label: 'First name',
        value: this.authenticatedUserDetails.firstName,
        readOnly: true
      }),
      lastname: new Field<string>({
        label: 'Last name',
        value: this.authenticatedUserDetails.lastName,
        readOnly: true
      })
    });



    if (profile !== Profile.ADMIN){
      this.academicFieldSetTemplate = new FieldSet<AcademicFieldSetTemplate>({
        department: new Field<string>({
          label: 'Department',
          value: userAttributes.department,
          readOnly: true
        })
      });
    }

    console.log(profile);
    console.log(userAttributes);


    if (this.isStudent(profile)){

      this.academicFieldSetTemplate.add('studentCode', new Field<string>({
        label: 'Student Code',
        value: userAttributes.studentCode,
        readOnly: true
      }));

      this.academicFieldSetTemplate.add('subject', new Field<string>({
        label: 'Subject',
        value: userAttributes.subject,
        readOnly: true
      }));

      this.academicFieldSetTemplate.add('managerName', new Field<Supervisor,string>({
        label: 'Manager Name',
        value: this.managerDetails.name,
        readOnly: true
      }));

      this.academicFieldSetTemplate.add('managerEmail', new Field<Supervisor,string>({
        label: 'Manager address',
        value:  this.managerDetails.email,
        readOnly: true
      }));

    }


    if (profile === Profile.GUEST){

      this.academicFieldSetTemplate.add('coManagerName', new Field<Supervisor,string>({
        label: 'Co-Manager',
        value: this.coManagerDetails.name,
        readOnly: true
      }));

      this.academicFieldSetTemplate.add('coManagerEmail', new Field<Supervisor, string>({
        label: 'Co-Manager address',
        value: this.coManagerDetails.email,
        readOnly: true
      }));

      this.academicFieldSetTemplate.add('description', new Field<string>({
        label: 'Description',
        value: userAttributes.description,
        readOnly: true
      }));
    }
  }


  private isAdmin(profile: Profile): boolean {
    return this.isDelegated ||
      profile === Profile.ADMIN ||
      profile === Profile.PROFESSOR;
  }

  private isStudent(profile: Profile): boolean {
    return profile === Profile.PHD_STUDENT || profile === Profile.GUEST;
  }

  displayProfileActions(): boolean {
    return !this.basicFieldSetTemplate.isStatic();
  }

  resetBasicFieldSetTemplate(): void{
    this.basicFieldSetTemplate.reset({
      email: this.authenticatedUserDetails.email
    });
  }

  canExit(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.basicFieldSetTemplate.touched) {
      const confirmRef = this.dialogService.open<ConfirmComponent, ConfirmDialogData, boolean>(
        ConfirmComponent,
        confirmDialogConfig({
          title: 'Discard changes ?',
          message: 'your changes will ignored'
        })
      );
      return confirmRef.afterClosed();
    }
    return true;
  }

  saveAuthenticatedUserProfile(): void {
    this.authenticatedUserDetails.email =
      this.basicFieldSetTemplate.getField('email').value;

    this.userService.update(this.authenticatedUserDetails)
      .subscribe({
        error: err => {
          this.snackBarService.openFromComponent(
            SnackBarComponent,
            notificationConfig({
              operation: 'profile updated ',
              success: false
            })
          );
        },
        complete: () => {
          this.snackBarService.openFromComponent(
            SnackBarComponent,
            notificationConfig({
              operation: 'profile updated ',
              success: true
            })
          );
          this.resetBasicFieldSetTemplate();
        }
      })
  }
}
