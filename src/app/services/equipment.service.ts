import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Category, Equipment} from "../models/equipment.model";
import {catchError, Observable, of, switchMap} from "rxjs";
import {FormGroup} from "@angular/forms";
import {OnAction} from "../utils/actions.utils";

@Injectable({
  providedIn: 'root'
})
export class EquipmentService {

  equipmentsBaseUrl: string = environment.equipmentApi.baseUrl;
  categoriesEndpoint: string = environment.equipmentApi.endpoints['categories'];

  constructor(private http: HttpClient) {}

  create(equipment: Equipment): Observable<Equipment>{
    const formData: FormData = new FormData();
    Object.keys(equipment)
      .forEach(key => formData.append(key, equipment[key]));

    return this.http.post<Equipment>(this.equipmentsBaseUrl, formData);
  }

  update(equipment: Equipment): Observable<Equipment>{
    const url: string = `${this.equipmentsBaseUrl}/${equipment.id}`;
    return this.http.put<Equipment>(url, equipment);
  }

  setImage(id: string, image: Blob): Observable<Equipment>{
    const url: string = `${this.equipmentsBaseUrl}/${id}/set-image`;
    const imageFormData: FormData = new FormData();
    imageFormData.append('image', image);
    return this.http.put<Equipment>(url, imageFormData);
  }

  delete(id: string): Observable<OnAction>{
    const url: string = `${this.equipmentsBaseUrl}/${id}`;
    return this.http.delete<any>(url).pipe(
      switchMap(() => of(OnAction.DONE)),
      catchError(() => of(OnAction.ERROR))
    );
  }

  get(id: string): Observable<Equipment>{
    const url: string = `${this.equipmentsBaseUrl}/${id}`;
    return this.http.get<Equipment>(url);
  }

  getAll(): Observable<Equipment[]>{
    return this.http.get<Equipment[]>(this.equipmentsBaseUrl);
  }

  exists(name: string, exclude?: string): Observable<boolean>{
    const url: string = exclude ?
      `${this.equipmentsBaseUrl}/${name}/exists/${exclude}` :
      `${this.equipmentsBaseUrl}/${name}/exists`;
    return this.http.get<boolean>(url);
  }




  createCategory(name: string): Observable<Category>{
    const url: string = `${this.equipmentsBaseUrl}${this.categoriesEndpoint}`;
    return this.http.post<Category>(url, name);
  }

  renameCategory(id: number, categoryName: string): Observable<Category>{
    const url: string = `${this.equipmentsBaseUrl}${this.categoriesEndpoint}/${id}`;
    return this.http.put<Category>(url, categoryName);
  }

  deleteCategory(id: number): Observable<OnAction>{
    const url: string = `${this.equipmentsBaseUrl}${this.categoriesEndpoint}/${id}`;
    return this.http.delete(url).pipe(
      switchMap(() => of(OnAction.DONE)),
      catchError(() => of(OnAction.ERROR))
    );
  }

  getCategory(id: string): Observable<Category>{
    const url: string = `${this.equipmentsBaseUrl}${this.categoriesEndpoint}/${id}`;
    return this.http.get<Category>(url);
  }

  getAllCategories(): Observable<Category[]>{
    const url: string = `${this.equipmentsBaseUrl}${this.categoriesEndpoint}`;
    return this.http.get<Category[]>(url);
  }

  existsCategory(name: string, exclude?: number): Observable<boolean>{
    const url: string = exclude ?
      `${this.equipmentsBaseUrl}${this.categoriesEndpoint}/${name}/exists/${exclude}`:
      `${this.equipmentsBaseUrl}${this.categoriesEndpoint}/${name}/exists`;

    return this.http.get<boolean>(url);
  }

}
