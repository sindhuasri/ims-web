import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { Inventories } from '../models/inventories';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  constructor(private http: HttpClient) {}

  public getInventories(
    pageNumber: Number,
    pageSize: Number,
    selectedWarehouse: number
  ): Observable<Inventories> {

    let url = `http://localhost:8085/inventory/search?page=${--(pageNumber as number)}&size=${pageSize}`;
    if (selectedWarehouse != -1 ){url = url +`&warehouseId=${selectedWarehouse}`}
    return this.http.get<Inventories>(url);
  }
  public createInventory(
    itemName: string,
    warehouseName: string,
    quantity: Number
  ): Observable<any> {
    const request = {
      itemName: itemName,
      warehouseName: warehouseName,
      quantity:quantity
    }
    return this.http.post<any>(`http://localhost:8085/inventory/create`, request,);
     
  }

  public updateInventory(
    inventoryId: Number,
    quantity: Number
  ): Observable<Inventories> {
    const request = {
      inventoryId: inventoryId,
      quantity: quantity
    }
    return this.http.put<any>(`http://localhost:8085/inventory/update`, request);
      
  }
  public deleteInventory(
    inventoryId: Number
  ): Observable<any> {
    return this.http.delete<any>(`http://localhost:8085/inventory/delete?inventoryId=${inventoryId}`);
      
  }

  public getWarehouses(): Observable<any> {
    return this.http.get<any>(`http://localhost:8085/inventory/warehouses`);
      
  }
}
