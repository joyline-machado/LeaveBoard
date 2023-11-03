import { Component, OnInit, TemplateRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddUserComponent } from './add-user/add-user.component';
import { Employee } from 'src/app/model/employee';
import { DataService } from 'src/app/shared/data.service';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  userData!: Observable<any>;
  employeeList: Employee[] = [];
  isLoading: boolean = true;


  constructor(public dialog: MatDialog,
    private dataService: DataService,
    private firestore: Firestore
  ) { }

  ngOnInit(): void {
    this.getAllEmployees()
  }

  openDialog() {
    this.dialog.open(AddUserComponent, {
      width: '65%',
      height: '410px'
    });
  }

  getAllEmployees() {
    this.isLoading = true;
    const collectionInstance = collection(this.firestore, '/Users');
    collectionData(collectionInstance).subscribe(val => {
      console.log(val);
      this.isLoading = false;
    })
    this.userData = collectionData(collectionInstance, { idField: 'id' });


  }

  deleteEmployee(id: string) {
    this.dataService.deleteEmp(id);
  }

  openDeleteDialog(ref: TemplateRef<any>, id: string) {
    this.dialog.open(ref, {
      data: { id }
    });
  }

  openEditPopup(id: string){
    const dialogRef = this.dialog.open(AddUserComponent, {
      width: '65%',
      height: '420px',
      data:  {id}
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Edited data:', result);
        
      }
      else {
        console.log({id})
      }
    });
  }




}
