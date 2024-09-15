import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {MatTableDataSource} from "@angular/material/table";
import {Category} from "../../../../models/equipment.model";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {CategoryComponent} from "../category/category.component";
import {
  categoryPopupConfig,
  CategoryPopupData,
  confirmDialogConfig,
  ConfirmDialogData,
  notificationConfig,
  NotificationData
} from "../../../../utils/popup.utils";
import {MatDialog} from "@angular/material/dialog";
import {EquipmentService} from "../../../../services/equipment.service";
import {ConfirmComponent} from "../../../popup/confirm/confirm.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {SnackBarComponent} from "../../../popup/snack-bar/snack-bar.component";
import {categorySortingDataAccessor} from "../../../../utils/transformers.utils";
import {SearchComponent} from "../../../forms/search/search.component";
import {of, switchMap} from "rxjs";
import {OnAction} from "../../../../utils/actions.utils";

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent implements OnInit, AfterViewInit{

  displayedColumns: string[] = [
    'ID',
    'Name',
    'Edit',
    'Delete'
  ];


  datasource: MatTableDataSource<Category>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) matSort: MatSort;
  @ViewChild('searchComponent') searchComponent!: SearchComponent;

  constructor(private activatedRoute: ActivatedRoute,
              private equipmentService: EquipmentService,
              private dialogService: MatDialog,
              private snackBarService: MatSnackBar) {
  }

  ngOnInit(): void {

    this.activatedRoute.data.subscribe({
      next: data => {
        this.datasource = new MatTableDataSource(data['categories'] as Category[]);
      }
    });

    this.datasource.sortingDataAccessor = categorySortingDataAccessor;

  }

  ngAfterViewInit(): void {
    this.datasource.paginator = this.paginator;
    this.datasource.sort = this.matSort;
  }


  onSearchKeywordChanged(keyword: string) {

    if(!keyword.trim()){
      this.datasource.filter = '';
      return;
    }

    this.datasource.filter = keyword;
    if(this.datasource.paginator)
      this.datasource.paginator.firstPage();
  }


  onCreateCategory(): void{
    this.openCategoryWindow({mode: 'create'});
  }

  onEditCategory(id: number, name: string) {
    this.openCategoryWindow({
      mode: 'update',
      id: id,
      name: name
    });
  }

  onDeleteCategory(id: number, name: string) {

    const confirmDialogRef = this.dialogService
      .open<ConfirmComponent, ConfirmDialogData, boolean>(
        ConfirmComponent,
        confirmDialogConfig({
          title: 'Delete category?',
          message: `all equipments related to ${name} category will deleted`
        })
      );

    confirmDialogRef.afterClosed()
      .pipe(
        switchMap(response => {
          if (response)
            return this.equipmentService.deleteCategory(id);
          return of(OnAction.CANCELLED);
        })
      ).subscribe({
      next: onAction => {
        if (onAction === OnAction.DONE){
          this.snackBarService
            .openFromComponent<SnackBarComponent, NotificationData>(
              SnackBarComponent,
              notificationConfig({
                type: 'success',
                message: 'category deleted successfully'
              })
            );
          this.refresh();
        }
        if(onAction === OnAction.ERROR){
          this.snackBarService
            .openFromComponent<SnackBarComponent, NotificationData>(
              SnackBarComponent,
              notificationConfig({
                type: 'error',
                message: 'delete category failed'
              })
            );
        }
      }
    });

  }

  refresh(): void {
    this.searchComponent.reset();
    this.equipmentService.getAllCategories()
      .subscribe({
        next: categories => {
          this.datasource.data = categories;
        }
      });
  }

  private openCategoryWindow(data: CategoryPopupData) {
    const categoryDialogRef= this.dialogService
      .open<CategoryComponent, any, boolean>(
        CategoryComponent,
        categoryPopupConfig(data)
      );

    categoryDialogRef.afterClosed()
      .subscribe({
        next: submitted => {
          if (submitted) this.refresh();
        }
      });
  }





}
