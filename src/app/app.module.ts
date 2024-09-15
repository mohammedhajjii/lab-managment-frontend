import {APP_INITIALIZER, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './ui/home/home.component';
import {KeycloakAngularModule, KeycloakService} from "keycloak-angular";
import {initializeKeycloak} from "./configs/keycloakConf";
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatTableModule} from "@angular/material/table";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatCardModule} from "@angular/material/card";
import {MatMenuModule} from "@angular/material/menu";
import {MatListModule, MatNavList} from "@angular/material/list";
import { PasswordComponent } from './ui/password/password.component';
import { ProfileInfosComponent } from './ui/profile-infos/profile-infos.component';
import { TemplateComponent } from './ui/template/template.component';
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {HttpClientModule} from "@angular/common/http";
import {MatFormFieldModule} from "@angular/material/form-field";
import {ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatSortModule} from "@angular/material/sort";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatSelectModule} from "@angular/material/select";
import { UserRepresentationComponent } from './ui/users/user-representation/user-representation.component';
import { UserCreationComponent } from './ui/users/user-creation/user-creation.component';
import {MatStepperModule} from "@angular/material/stepper";
import {MatExpansionModule} from "@angular/material/expansion";
import { AuthDirective } from './directives/auth.directive';
import { ErrorComponent } from './ui/error/error.component';
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import { AllUsersComponent } from './ui/users/all-users/all-users.component';
import {MatGridListModule} from "@angular/material/grid-list";
import {MatTooltipModule} from "@angular/material/tooltip";
import { FormInputComponent } from './ui/forms/form-input/form-input.component';
import { FormToggleComponent } from './ui/forms/form-toggle/form-toggle.component';
import { FormSelectComponent } from './ui/forms/form-select/form-select.component';
import { FormPasswordComponent } from './ui/forms/form-password/form-password.component';
import {MatDialogModule} from "@angular/material/dialog";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatDividerModule} from "@angular/material/divider";
import { SnackBarComponent } from './ui/popup/snack-bar/snack-bar.component';
import { AccountPopupComponent } from './ui/popup/account-popup/account-popup.component';
import {OverlayModule} from "@angular/cdk/overlay";
import { NavItemComponent } from './ui/template/nav-item/nav-item.component';
import { EditFieldDialogComponent } from './ui/popup/edit-field-dialog/edit-field-dialog.component';
import { FieldComponent } from './ui/field/field.component';
import { FieldGroupComponent } from './ui/field/field-group/field-group.component';
import {DatePipe, NgOptimizedImage} from "@angular/common";
import { ConfirmComponent } from './ui/popup/confirm/confirm.component';
import {MatBadgeModule} from "@angular/material/badge";
import { FragmentComponent } from './ui/fragment/fragment.component';
import {MatTabsModule} from "@angular/material/tabs";
import { TipsComponent } from './ui/tips/tips.component';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {CdkTrapFocus} from "@angular/cdk/a11y";
import { AllDepartmentsComponent } from './ui/departments/all-departments/all-departments.component';
import { CreateDepartmentComponent } from './ui/departments/create-department/create-department.component';
import { FilterControlComponent } from './ui/filters/filter-control/filter-control.component';
import { FilterGroupComponent } from './ui/filters/filter-group/filter-group.component';
import { EquipmentsComponent } from './ui/equipments/equipments/equipments.component';
import { EquipmentDetailsComponent } from './ui/equipments/equipment-details/equipment-details.component';
import { NewEquipmentComponent } from './ui/equipments/new-equipment/new-equipment.component';
import { FormFileComponent } from './ui/forms/form-file/form-file.component';
import { SearchComponent } from './ui/forms/search/search.component';
import { CategoriesComponent } from './ui/equipments/categories/categories/categories.component';
import { CategoryComponent } from './ui/equipments/categories/category/category.component';
import { EquipmentPreviewComponent } from './ui/equipments/equipment-preview/equipment-preview.component';
import { EquipmentQrcodeComponent } from './ui/equipments/equipment-qrcode/equipment-qrcode.component';
import { EquipmentStatusComponent } from './ui/equipments/equipment-status/equipment-status.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PasswordComponent,
    ProfileInfosComponent,
    TemplateComponent,
    UserRepresentationComponent,
    UserCreationComponent,
    AuthDirective,
    ErrorComponent,
    AllUsersComponent,
    FormInputComponent,
    FormToggleComponent,
    FormSelectComponent,
    FormPasswordComponent,
    SnackBarComponent,
    AccountPopupComponent,
    NavItemComponent,
    EditFieldDialogComponent,
    FieldComponent,
    FieldGroupComponent,
    ConfirmComponent,
    FragmentComponent,
    TipsComponent,
    AllDepartmentsComponent,
    CreateDepartmentComponent,
    FilterControlComponent,
    FilterGroupComponent,
    EquipmentsComponent,
    EquipmentDetailsComponent,
    NewEquipmentComponent,
    FormFileComponent,
    SearchComponent,
    CategoriesComponent,
    CategoryComponent,
    EquipmentPreviewComponent,
    EquipmentQrcodeComponent,
    EquipmentStatusComponent,
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        KeycloakAngularModule,
        ReactiveFormsModule,
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
        MatTableModule,
        MatSidenavModule,
        MatCardModule,
        MatMenuModule,
        MatNavList,
        MatListModule,
        MatProgressBarModule,
        HttpClientModule,
        MatFormFieldModule,
        MatTableModule,
        MatInputModule,
        MatPaginatorModule,
        MatSortModule,
        MatButtonToggleModule,
        MatSelectModule,
        MatStepperModule,
        MatExpansionModule,
        MatSlideToggleModule,
        MatGridListModule,
        MatTooltipModule,
        MatDialogModule,
        MatSnackBarModule,
        MatDividerModule,
        OverlayModule,
        MatBadgeModule,
        MatTabsModule,
        MatProgressSpinnerModule,
        NgOptimizedImage,
    ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService]
    },
    provideAnimationsAsync(),
    DatePipe
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
