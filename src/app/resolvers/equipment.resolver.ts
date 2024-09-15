import {ResolveFn} from "@angular/router";
import {Category, Equipment} from "../models/equipment.model";
import {EquipmentService} from "../services/equipment.service";
import {inject} from "@angular/core";


export const allEquipmentResolver: ResolveFn<Equipment[]> = () => {
  const equipmentService: EquipmentService = inject<EquipmentService>(EquipmentService);
  return equipmentService.getAll();
}


export const equipmentResolver: ResolveFn<Equipment> = route => {
  const equipmentService: EquipmentService = inject<EquipmentService>(EquipmentService);
  return equipmentService.get(route.paramMap.get('id'));
}

export const allEquipmentCategoriesResolver: ResolveFn<Category[]> = () => {
  const equipmentService: EquipmentService = inject<EquipmentService>(EquipmentService);
  return equipmentService.getAllCategories();
}
