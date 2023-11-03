import { AfterViewInit, Component, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ApplyLeaveComponent } from './apply-leave/apply-leave.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Firestore, Query, collection, collectionData, query, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { EmployeeService } from 'src/app/shared/employee.service';


interface UserData {
  id: string;
  name: string;
  email: string,
  empID: string
}

interface LeaveData {
  id: string;
  leaveType: string;
  leaveReason: string;
  status: string;
  leaveDate: Date;
  userName: string
}


@Component({
  selector: 'app-leaves',
  templateUrl: './leaves.component.html',
  styleUrls: ['./leaves.component.scss']
})
export class LeavesComponent implements AfterViewInit {

  isLoading : boolean = true;
  

  leavesData!: Observable<any>;
  loggedInUser: any;

  displayedColumns: string[] = [ 'name', 'progress', 'startDate','endDate', 'status', 'action'];
  dataSource: MatTableDataSource<LeaveData>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private dialog : MatDialog,
    private firestore: Firestore,
    private employeeService : EmployeeService
  ){
    const userData = localStorage.getItem('user');
    if (userData) {
      this.loggedInUser = JSON.parse(userData);
    }

    this.getLeavesData()
    
    // const users = Array.from({length: 100}, (_, k) => createNewUser(k + 1));

    // Assign the data to the data source for the table to render
    // this.dataSource = new MatTableDataSource(users);
    this.dataSource = new MatTableDataSource<LeaveData>([]);
  }

  openDialog() {
    this.dialog.open(ApplyLeaveComponent, {
      width: '65%',
      height: '350px'
    });
  }

  ngAfterViewInit() {
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;

    // console.log(this.dataSource)
    this.dataSource = new MatTableDataSource<LeaveData>([]);

    this.leavesData.subscribe((data: LeaveData[]) => {
      this.dataSource.data = data;

      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

      this.isLoading = false;
    });
  }

  deleteLeave(id: string){
    this.employeeService.deleteLeave(id);
   }
 
   openDeleteDialog(ref: TemplateRef<any>, id: string) {
     this.dialog.open(ref, {
       data: { id }
     });
   }
 

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

 

  getLeavesData() {
    this.isLoading = true;
    let loggedInUserEmail = this.loggedInUser.email;
    const leavesCollection = collection(this.firestore, 'Leaves');
  
    const userLeavesQuery = query(leavesCollection, where('userName', '==', loggedInUserEmail));
  
    this.leavesData = collectionData(userLeavesQuery, { idField: 'id' });
  
    this.leavesData.subscribe((data: LeaveData[]) => {
      this.dataSource.data = data;
      this.isLoading = false;
      // this.changeDetectorRef.detectChanges();
    });
  }
  

 

  openEditLeavePopup(id: string){
    const dialogRef = this.dialog.open(ApplyLeaveComponent, {
      width: '65%',
      height: '350px',
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

/** Builds and returns a new User. */
