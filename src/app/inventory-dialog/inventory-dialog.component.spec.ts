import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { InventoryDialogComponent } from './inventory-dialog.component';

describe('InventoryDialogComponent', () => {
  let component: InventoryDialogComponent;
  let fixture: ComponentFixture<InventoryDialogComponent>;


  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InventoryDialogComponent],
      imports: [
        MatButtonModule,
        MatDialogModule,
        HttpClientModule
      ],
      providers: [
        {
          // I was expecting this will pass the desired value
          provide: MAT_DIALOG_DATA,
          useValue: {
            
          }
        },{
          provide: MatDialogRef,
          useValue: {}
        },
        {
          provide: MatSnackBar,
          useValue:{}
        }
      ]
    },
   );
    fixture = TestBed.createComponent(InventoryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
