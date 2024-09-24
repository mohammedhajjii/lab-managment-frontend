import {Component, computed, effect, OnInit, signal, ViewChild} from '@angular/core';
import {
  AllEquipmentStatus, allEquipmentStatusValues,
  EquipmentFilter,
  EquipmentStatusForFilter,
  FilterControl,
  FilterGroup, FilterGroupData
} from "../../../utils/filters.utils";
import {Category, Equipment, EquipmentStatus} from "../../../models/equipment.model";
import {Mappers} from "../../../utils/controls.template";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {NewEquipmentComponent} from "../new-equipment/new-equipment.component";
import {equipmentPopupConfig, EquipmentPopupData} from "../../../utils/popup.utils";
import {ActivatedRoute} from "@angular/router";
import {EquipmentService} from "../../../services/equipment.service";
import {SearchComponent} from "../../forms/search/search.component";

@Component({
  selector: 'app-equipments',
  templateUrl: './equipments.component.html',
  styleUrl: './equipments.component.css'
})
export class EquipmentsComponent implements OnInit{

  equipmentFiler!: FilterGroup<EquipmentFilter>;
  equipments!: Equipment[];
  displayedEquipments!: Equipment[];
  categories!: Category[];


  equipmentsSignal = signal<Equipment[]>([]);



  @ViewChild(SearchComponent) searchComponent!: SearchComponent;

  constructor(private activatedRoute: ActivatedRoute,
              private equipmentService: EquipmentService,
              private dialogService: MatDialog) {
  }

  ngOnInit(): void {

    this.activatedRoute.data.subscribe({
      next: data => {
        this.categories = data['categories'] as Category[];
        this.equipments = data['equipments'] as Equipment[];
        this.displayedEquipments = this.equipments;
      }
    });

    this.equipmentFiler = new FilterGroup<EquipmentFilter>({
      category: new FilterControl<Category, EquipmentStatus, number, Equipment>({
        label: 'Filter by category',
        placeholder: 'category',
        origin: this.categories,
        valueMapper: Mappers.equipmentCategoryValueMapper,
        labelMapper: Mappers.equipmentCategoryLabelMapper,
        all: 0,
        external: v => eq => eq.category.id === v
      }),
      status: new FilterControl<EquipmentStatusForFilter, any, EquipmentStatusForFilter, Equipment>({
        label: 'Filter by status',
        placeholder: 'category',
        origin: allEquipmentStatusValues,
        valueMapper: Mappers.equipmentStatusMapper,
        labelMapper: Mappers.equipmentStatusMapper,
        all: AllEquipmentStatus.ALL,
        external: v => eq => eq.status === v
      })
    });
  }


  newEquipment() {

    const newEquipmentDialogRef = this.dialogService
      .open<NewEquipmentComponent, EquipmentPopupData, Equipment>(
        NewEquipmentComponent,
        equipmentPopupConfig({
          categories: this.categories
        })
      );

    newEquipmentDialogRef.afterClosed()
      .subscribe({
        next: result => {
          if (result){
            this.equipments.push(result);
            this.onFilterGroupValuesChanges(this.equipmentFiler.getRawValues());
          }
        }
      });
  }

  onFilterGroupValuesChanges(values: FilterGroupData<EquipmentFilter>): void {
    this.displayedEquipments = this.equipments
      .filter(this.equipmentFiler.getFilterControl('category')
        .applyExternalPredicateFn(values.category))
      .filter(this.equipmentFiler.getFilterControl('status')
        .applyExternalPredicateFn(values.status));

  }


  onSearchKeyword(keyword: string) {
    console.log(keyword);
    this.displayedEquipments = this.displayedEquipments
      .filter(eq => eq.name.includes(keyword) || eq.category.name.includes(keyword));
  }

  refresh(): void{
    this.searchComponent.reset();
    this.equipmentService.getAll()
      .subscribe({
        next: equipments => {
          this.equipments = equipments;
          this.onFilterGroupValuesChanges(this.equipmentFiler.getRawValues());
        }
      });
  }

}


