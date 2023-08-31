
import {AfterViewInit, Component, ViewChild} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort'
import { MatTableDataSource } from '@angular/material/table';
import { catchError, map, Observable, startWith, switchMap } from 'rxjs';
import { Inventories } from '../models/inventories';
import { Inventory } from '../models/inventory';
import { InventoryService } from './inventory.service';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { InventoryDialogComponent } from '../inventory-dialog/inventory-dialog.component';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { AppService } from '../app.service';
import { FormControl } from '@angular/forms';
import { Warehouse } from '../models/warehouse';


@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})

export class InventoryComponent implements AfterViewInit {
  constructor(private inventoryService: InventoryService,
    public dialog: MatDialog,private appService: AppService) {
}
  
  displayedColumns: string[] = ['warehouseName', 'itemName', 'quantity','action','delete'];
  dataSource = new MatTableDataSource<Inventory>();
  isLoading = false;
  totalData: number;
  inventories: Inventory[];
  selectedWarehouse:number = -1;
  warehouses: Warehouse[];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  getTableData$(pageNumber: Number, pageSize: Number) {
    return this.inventoryService.getInventories(pageNumber, pageSize, this.selectedWarehouse);
  }
  getWarehouses() {
    return this.inventoryService.getWarehouses().subscribe(w => {
      this.warehouses = w.warehouses;
      this.selectedWarehouse = -1;
    },
    error => {
      this.appService.openSnackBar("Cannot get the warehouses","Warehouse");
    }
    );
  }
  ngOnInit(){
    this.getWarehouses();
  }
  ngAfterViewInit(){
    this.loadData();
  }
  loadData() {
    this.dataSource.paginator = this.paginator;

    this.paginator.page
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoading = true;
          return this.getTableData$(
            this.paginator.pageIndex + 1,
            this.paginator.pageSize
          ).pipe(catchError(() => this.observableOf(null)));
        }),
        map((inventories) => {
          if (inventories == null) return [];
          const inventoryPage = inventories as Inventories;
          this.totalData = inventoryPage.totalItems;
          this.isLoading = false;
          return inventoryPage.inventories;
        })
      )
      .subscribe((inventories:Inventory[]) => {
        this.inventories = inventories;
        this.dataSource = new MatTableDataSource(this.inventories);
      });
  }
  editInventory(inventory: Inventory) {
    const dialogRef = this.dialog.open(InventoryDialogComponent, {
      data: { mode: 'edit',
        inventory: inventory},
    });

    dialogRef.afterClosed().subscribe(result => {
      this.loadData();
    });
  }
  deleteInventory(inventory: Inventory) {
    if (!inventory.inventoryId){
      this.appService.openSnackBar('Inventory Id is invalid','Inventory');
    }
    this.inventoryService.deleteInventory(inventory.inventoryId as number)
     .subscribe(result => {
      this.appService.openSnackBar('Inventory Deleted','Inventory');
      this.loadData();
      },
      error =>{
        this.appService.openSnackBar(error?.error?.message ?? "Some error occured","Inventory");
      });
   
  }
  saveInventory(){
    let inventory: Inventory = {
      itemName:'',
      warehouseName:'',
      quantity:0,
    };
    const dialogRef = this.dialog.open(InventoryDialogComponent, {
      data: { mode: 'save',
        inventory: inventory},
    });
    dialogRef.afterClosed().subscribe(result => {
      this.loadData();
    });
  }
  warehouseSelected(){
    if (this.selectedWarehouse) {
      this.loadData();
    }
  }
  observableOf(arg0: null): any {
    this.appService.openSnackBar('Inventory API not available','Inventory');
  }
 
}


