import { Component, Input, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inventory } from '../models/inventory';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InventoryService } from '../inventory/inventory.service';
import {MatSnackBar, MatSnackBarRef, MatSnackBarModule} from '@angular/material/snack-bar';
import { AppService } from '../app.service';
import { catchError } from 'rxjs';

@Component({
  selector: 'app-inventory-dialog',
  templateUrl: './inventory-dialog.component.html',
  styleUrls: ['./inventory-dialog.component.scss']
})
export class InventoryDialogComponent implements OnInit {
  inventory: Inventory;
  mode: 'edit'
  form: FormGroup;
  constructor(public dialogRef: MatDialogRef<InventoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private formBuilder: FormBuilder,
    private inventoryService: InventoryService,private appService: AppService) {
    this.inventory = data.inventory;
    this.mode = data.mode;
  }
  ngOnInit(): void {
    this.form = this.formBuilder.group({
      warehouseName: [this.inventory.warehouseName,Validators.required],
      itemName: [this.inventory.itemName,Validators.required],
      quantity: [this.inventory.quantity,[Validators.required, Validators.min(1)]],
    });
  }
  cancel(): void {
    
    this.dialogRef.close();
  }

  submit(): void {
    console.log(this.form);
    if (!this.form.valid) {
      this.appService.openSnackBar("form validation failed","Inventory");
      return;
    }
   
    if (this.mode === 'edit') {
      this.inventoryService.updateInventory(this.inventory.inventoryId as Number,this.form.value.quantity)
      .subscribe(result =>{
        this.appService.openSnackBar("Updated Successfully!","Inventory");
        this.dialogRef.close();
      },
      error =>{
        this.appService.openSnackBar(error?.error?.message ?? "Some error occured","Inventory");
      });
    }
    else{
      this.inventoryService.createInventory(this.form.value.itemName ,this.form.value.warehouseName,
        this.form.value.quantity).subscribe(result => {
          this.appService.openSnackBar("Created Successfully!","Inventory");
          this.dialogRef.close();
        },
        error =>{
          this.appService.openSnackBar(error?.error?.message ?? "Some error occured","Inventory");
        });
    }
    
  }
}

 

